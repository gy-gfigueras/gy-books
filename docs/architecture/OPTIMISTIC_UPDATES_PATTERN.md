# Patrón de Optimistic Updates con SWR

## 📋 Resumen

Este documento describe el patrón implementado para actualizar datos del usuario con **optimistic updates** usando SWR. Este patrón proporciona una experiencia de usuario inmediata mientras mantiene la consistencia de datos y maneja errores correctamente.

## 🎯 Objetivos del Patrón

1. **Experiencia de Usuario Inmediata**: El usuario ve sus cambios al instante
2. **Consistencia de Datos**: El estado global se sincroniza correctamente con el servidor
3. **Manejo de Errores Robusto**: Rollback automático si la actualización falla
4. **Escalabilidad**: Patrón reutilizable para cualquier campo editable
5. **Mantenibilidad**: Separación clara de responsabilidades

## 🏗️ Arquitectura

### Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                         COMPONENTE                              │
│  (ProfilePage.tsx)                                              │
│  - Consume hooks                                                │
│  - Renderiza UI                                                 │
│  - No contiene lógica de negocio                                │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      HOOK DE UI                                 │
│  (useProfileBiography.ts)                                       │
│  - Maneja estado de edición (isEditing)                        │
│  - Mantiene valor temporal durante edición                      │
│  - Sincroniza con estado global                                 │
│  - Coordina acciones de guardar/cancelar                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     HOOK DE DATOS                               │
│  (useBiography.ts)                                              │
│  - Implementa optimistic update con SWR                         │
│  - Maneja llamadas a la API                                     │
│  - Gestiona estados de loading/error/success                    │
│  - Rollback automático en caso de error                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER ACTION                                │
│  (updateBiography.ts)                                           │
│  - Ejecuta la actualización en el servidor                      │
│  - Retorna void en éxito o lanza error                          │
│  - NO maneja estado - solo lógica de red                        │
└─────────────────────────────────────────────────────────────────┘
```

## 📝 Implementación

### 1. Server Action

```typescript
// src/app/actions/book/updateBiography.ts
'use server';

export default async function updateBiography(
  biography: string
): Promise<void> {
  // Validación
  if (!biography) throw new Error('No biography provided');

  // Llamada al API
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ biography }),
    headers: { 'Content-Type': 'application/json' },
  });

  // Si falla, lanzar error
  if (!response.ok) {
    throw new Error(`Failed with status ${response.status}`);
  }

  // Status 204 (No Content) - éxito sin cuerpo de respuesta
  return;
}
```

**Principios:**

- ✅ Retorna `void` en éxito (status 204)
- ✅ Lanza error en fallo
- ✅ NO maneja estado UI
- ✅ Solo lógica de red

### 2. Hook de Datos (useBiography)

```typescript
// src/hooks/useBiography.ts
import { mutate } from 'swr';
import { User } from '@/domain/user.model';

const USER_CACHE_KEY = '/api/auth/get';

export function useBiography() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleUpdateBiography = async (newBiography: string) => {
    setIsLoading(true);
    setIsError(false);

    try {
      // Optimistic update con SWR
      await mutate(
        USER_CACHE_KEY,
        async (currentUser: User | undefined) => {
          if (!currentUser) throw new Error('No user in cache');

          // Ejecutar actualización en servidor
          await updateBiography(newBiography);

          // Retornar datos actualizados
          return {
            ...currentUser,
            biography: newBiography,
          };
        },
        {
          // Datos que el usuario ve inmediatamente
          optimisticData: (currentUser: User | undefined) => {
            if (!currentUser) return currentUser;
            return {
              ...currentUser,
              biography: newBiography,
            };
          },
          // Revertir si hay error
          rollbackOnError: true,
          // Revalidar después del éxito
          revalidate: true,
          // Poblar cache inmediatamente
          populateCache: true,
        }
      );

      setIsUpdated(true);
    } catch (error) {
      console.error('Error updating biography:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleUpdateBiography,
    isLoading,
    isError,
    isUpdated,
    setIsError,
    setIsUpdated,
  };
}
```

**Principios:**

- ✅ Usa `mutate` de SWR con optimistic updates
- ✅ Rollback automático si falla (`rollbackOnError: true`)
- ✅ Revalida desde servidor después del éxito
- ✅ Maneja estados de loading/error/success
- ✅ NO maneja UI - solo lógica de datos

### 3. Hook de UI (useProfileBiography)

```typescript
// src/app/profile/hooks/useProfileBiography.ts
import { useEffect, useState } from 'react';
import { useBiography } from '@/hooks/useBiography';

export function useProfileBiography(user: User | null) {
  const {
    handleUpdateBiography,
    isLoading,
    isError,
    isUpdated,
    setIsError,
    setIsUpdated,
  } = useBiography();

  // Estado de UI
  const [isEditingBiography, setIsEditingBiography] = useState(false);
  const [biography, setBiography] = useState(user?.biography || '');

  // Sincronizar con estado global (solo cuando NO está editando)
  useEffect(() => {
    if (!isEditingBiography && user?.biography !== undefined) {
      setBiography(user.biography);
    }
  }, [user?.biography, isEditingBiography]);

  const handleBiographySave = async () => {
    await handleUpdateBiography(biography || '');
    if (!isError) {
      setIsEditingBiography(false);
    }
  };

  const handleEditBiography = () => {
    setBiography(user?.biography || '');
    setIsEditingBiography(true);
  };

  const handleCancelBiography = () => {
    setBiography(user?.biography || '');
    setIsEditingBiography(false);
    setIsError(false);
  };

  return {
    biography,
    isEditingBiography,
    isLoadingBiography: isLoading,
    isErrorBiography: isError,
    isUpdatedBiography: isUpdated,
    handleBiographyChange: setBiography,
    handleBiographySave,
    handleEditBiography,
    handleCancelBiography,
    setIsErrorBiography: setIsError,
    setIsUpdatedBiography: setIsUpdated,
  };
}
```

**Principios:**

- ✅ Maneja solo estado de UI (modo edición)
- ✅ Sincroniza con estado global del usuario
- ✅ NO actualiza cuando está en modo edición (evita sobrescribir lo que escribe el usuario)
- ✅ Delega la lógica de datos a `useBiography`

### 4. Componente (ProfilePage)

```typescript
// src/app/profile/page.tsx
function ProfilePageContent() {
  const user = useSelector((state: RootState) => state.user.profile);

  const {
    biography,
    isEditingBiography,
    isLoadingBiography,
    isUpdatedBiography,
    isErrorBiography,
    handleBiographyChange,
    handleBiographySave,
    handleEditBiography,
    handleCancelBiography,
    setIsUpdatedBiography,
    setIsErrorBiography,
  } = useProfileBiography(user);

  return (
    <>
      <ProfileHeader
        biography={biography}
        isEditingBiography={isEditingBiography}
        isLoadingBiography={isLoadingBiography}
        onBiographyChange={handleBiographyChange}
        onBiographySave={handleBiographySave}
        onEditProfile={handleEditBiography}
        onBiographyCancel={handleCancelBiography}
      />

      <AnimatedAlert
        open={isUpdatedBiography}
        onClose={() => setIsUpdatedBiography(false)}
        message="Biography updated successfully"
        severity="success"
      />

      <AnimatedAlert
        open={isErrorBiography}
        onClose={() => setIsErrorBiography(false)}
        message="Error updating biography"
        severity="error"
      />
    </>
  );
}
```

**Principios:**

- ✅ Solo consume hooks y renderiza
- ✅ NO contiene lógica de negocio
- ✅ Pasa handlers a componentes hijos

## 🔄 Flujo Completo de Actualización

### Caso Exitoso

```
1. Usuario hace clic en "Edit"
   → handleEditBiography()
   → isEditingBiography = true
   → biography = user.biography (sincroniza)

2. Usuario escribe "Nueva biografía"
   → handleBiographyChange("Nueva biografía")
   → biography = "Nueva biografía" (estado local)

3. Usuario hace clic en "Save"
   → handleBiographySave()
   → handleUpdateBiography("Nueva biografía")

4. Optimistic Update (INMEDIATO)
   → SWR actualiza cache local con nueva biografía
   → Usuario VE el cambio al instante
   → isLoading = true

5. Server Action (EN PARALELO)
   → updateBiography("Nueva biografía")
   → POST al servidor
   → Servidor retorna 204 (éxito)

6. Revalidación (DESPUÉS DEL ÉXITO)
   → SWR hace refetch de /api/auth/get
   → Confirma que el servidor tiene los datos correctos
   → isLoading = false
   → isUpdated = true
   → Muestra alert de éxito

7. Sincronización Final
   → useEffect detecta cambio en user.biography
   → Actualiza estado local (aunque ya está igual)
   → isEditingBiography = false
```

### Caso con Error

```
1-3. [Igual que caso exitoso hasta el paso 3]

4. Optimistic Update (INMEDIATO)
   → SWR actualiza cache local
   → Usuario VE el cambio al instante
   → isLoading = true

5. Server Action (FALLA)
   → updateBiography("Nueva biografía")
   → POST al servidor
   → Servidor retorna 500 (error)
   → Lanza error

6. Rollback Automático
   → SWR detecta el error
   → rollbackOnError: true
   → Revierte el cache al valor anterior
   → Usuario VE la biografía original de nuevo
   → isLoading = false
   → isError = true
   → Muestra alert de error

7. Usuario puede reintentar
   → Sigue en modo edición (isEditingBiography = true)
   → Puede modificar y volver a guardar
```

## 🎨 Patrones de Uso

### Para Otros Campos (Nombre, Avatar, etc.)

```typescript
// 1. Crear Server Action
// src/app/actions/user/updateName.ts
export default async function updateName(name: string): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to update');
}

// 2. Crear Hook de Datos
// src/hooks/useName.ts
export function useName() {
  const handleUpdateName = async (newName: string) => {
    await mutate(
      '/api/auth/get',
      async (currentUser: User | undefined) => {
        if (!currentUser) throw new Error('No user');
        await updateName(newName);
        return { ...currentUser, name: newName };
      },
      {
        optimisticData: (user) => user ? { ...user, name: newName } : user,
        rollbackOnError: true,
        revalidate: true,
        populateCache: true,
      }
    );
  };

  return { handleUpdateName, /* estados */ };
}

// 3. Crear Hook de UI
// src/app/profile/hooks/useProfileName.ts
export function useProfileName(user: User | null) {
  const { handleUpdateName } = useName();
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing && user?.name) {
      setName(user.name);
    }
  }, [user?.name, isEditing]);

  return { name, isEditing, /* handlers */ };
}

// 4. Usar en componente
function ProfilePage() {
  const user = useSelector((state) => state.user.profile);
  const { name, handleNameSave } = useProfileName(user);
  return <NameEditor name={name} onSave={handleNameSave} />;
}
```

## ✅ Checklist de Implementación

Al implementar este patrón para un nuevo campo, verifica:

- [ ] **Server Action retorna `void`** (no retorna el valor actualizado)
- [ ] **Server Action lanza error** en caso de fallo
- [ ] **Hook de datos usa `mutate` con `optimisticData`**
- [ ] **Hook de datos tiene `rollbackOnError: true`**
- [ ] **Hook de datos tiene `revalidate: true`**
- [ ] **Hook de UI sincroniza con `useEffect`**
- [ ] **Hook de UI no actualiza durante edición** (`!isEditing` en useEffect)
- [ ] **Componente solo consume hooks** (sin lógica de negocio)
- [ ] **Tests cubren optimistic update y rollback**
- [ ] **Tests verifican sincronización de estado**

## 🧪 Testing

### Test de Optimistic Update

```typescript
it('should show optimistic update immediately', async () => {
  const { result } = renderHook(() => useBiography());

  mockMutate.mockImplementation(async (key, updateFn, options) => {
    // Verificar que se pasó optimisticData
    expect(options.optimisticData).toBeDefined();

    // Simular optimistic update
    const optimistic = options.optimisticData(mockUser);
    expect(optimistic.biography).toBe('New bio');

    return mockUser;
  });

  await act(async () => {
    await result.current.handleUpdateBiography('New bio');
  });
});
```

### Test de Rollback

```typescript
it('should rollback on error', async () => {
  mockUpdateBiography.mockRejectedValue(new Error('Server error'));

  const { result } = renderHook(() => useBiography());

  await act(async () => {
    await result.current.handleUpdateBiography('New bio');
  });

  expect(result.current.isError).toBe(true);
  expect(mockMutate).toHaveBeenCalledWith(
    expect.any(String),
    expect.any(Function),
    expect.objectContaining({ rollbackOnError: true })
  );
});
```

## 🚀 Beneficios

1. **UX Mejorada**: El usuario ve cambios instantáneos
2. **Resiliente**: Maneja errores de red automáticamente
3. **Consistente**: El estado siempre está sincronizado
4. **Testeable**: Cada capa es testeable independientemente
5. **Escalable**: Fácil de replicar para nuevos campos
6. **Mantenible**: Responsabilidades claras y separadas

## 📚 Referencias

- [SWR Mutation Documentation](https://swr.vercel.app/docs/mutation)
- [Optimistic UI Patterns](https://swr.vercel.app/docs/mutation#optimistic-updates)
- [React Server Actions](https://react.dev/reference/react/use-server)
