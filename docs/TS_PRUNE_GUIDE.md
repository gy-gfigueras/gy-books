# Detección de Código No Utilizado con ts-prune

`ts-prune` te ayuda a identificar exports que no están siendo utilizados en tu proyecto Next.js.

## 🚀 Comandos Disponibles

### Escaneo básico

```bash
npm run prune
```

Muestra todos los exports no utilizados en la terminal.

### Generar reporte

```bash
npm run prune:report
```

Genera un reporte completo y lo guarda en `unused-exports.txt`.

### Modo estricto (CI)

```bash
npm run prune:strict
```

Falla si encuentra exports no utilizados. Útil para CI/CD.

## 📋 Interpretando los Resultados

Los resultados se muestran así:

```
src/components/Button/Button.tsx:15 - ButtonVariant
src/hooks/useOldHook.ts:1 - default
```

**Formato:** `archivo:línea - nombre_del_export`

## ⚙️ Configuración

El archivo `.tsprunerc` excluye automáticamente:

- Archivos especiales de Next.js (page.tsx, layout.tsx, route.ts, etc.)
- Archivos de configuración
- Tests y mocks
- Tipos y definiciones

## 🎯 Qué Revisar

### ✅ Candidatos para eliminar:

- Hooks personalizados no utilizados
- Componentes creados pero nunca importados
- Utilidades y helpers antiguos
- Constantes o tipos duplicados

### ⚠️ Falsos positivos comunes:

- Componentes exportados para Storybook
- Exports usados en archivos de test
- Tipos exportados para librerías externas
- Server Actions en App Router

## 💡 Workflow Recomendado

1. **Después de cada build:**

   ```bash
   npm run build && npm run prune:report
   ```

2. **Revisa el archivo `unused-exports.txt`**

3. **Verifica antes de eliminar:**
   - Busca el export en el código: `grep -r "import.*NombreDelExport"`
   - Verifica que no se use dinámicamente

4. **Elimina con confianza** los exports realmente no utilizados

## 🔧 Personalización

Edita `.tsprunerc` para:

- Ignorar más archivos: `-i ruta/al/archivo`
- Incluir archivos específicos

## 📝 Notas

- **Next.js App Router:** Los exports en `page.tsx`, `layout.tsx`, y `route.ts` se ignoran automáticamente
- **Server Actions:** Si usas Server Actions, considera ignorar archivos con `"use server"`
- **Ejecución:** ts-prune es rápido pero puede tardar en proyectos grandes (30-60 seg)

## 🚨 Importante

**No elimines código sin verificar manualmente.** ts-prune puede reportar falsos positivos en casos como:

- Dynamic imports: `import(\`./components/\${name}\`)`
- Re-exports de librerías
- Exports usados en entornos de test específicos
