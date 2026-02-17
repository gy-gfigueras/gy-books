'use client';

import { lora } from '@/utils/fonts/fonts';
import dynamic from 'next/dynamic';

const RedocStandalone = dynamic(
  () => import('redoc').then((mod) => mod.RedocStandalone),
  {
    ssr: false,
  }
);

export default function DocsPage() {
  return (
    <div style={{ height: '100vh', backgroundColor: '#0A0A0A' }}>
      <RedocStandalone
        specUrl="/api/swagger"
        options={{
          scrollYOffset: 60,
          theme: {
            colors: {
              primary: {
                main: '#9333ea', // morado
              },
              text: {
                primary: '#E5E7EB', // gris claro (tailwind gray-200)
                secondary: 'black', // gris medio
              },
              http: {
                get: '#10b981',
                post: '#3b82f6',
                put: '#f59e0b',
                delete: '#ef4444',
                patch: '#ec4899',
                options: '#8b5cf6',
                head: '#14b8a6',
              },
            },
            typography: {
              fontFamily: lora.style.fontFamily,
              fontSize: '18px',
              code: {
                color: '#facc15', // amarillo suave para código
                backgroundColor: '#1f2937', // gris oscuro
              },
              links: {
                color: '#9E45F1',
                visited: '#a855f7',
              },
            },
            sidebar: {
              backgroundColor: '#1A1A1A',
              textColor: '#E4E4E7',
              groupItems: {
                activeBackgroundColor: '#2a2a2a',
              },
              arrow: {
                color: '#9E45F1',
              },
            },
            rightPanel: {
              backgroundColor: '#1E1E1E',
              textColor: 'white',
            },
          },
        }}
      />
    </div>
  );
}
