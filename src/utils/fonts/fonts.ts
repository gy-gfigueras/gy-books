import { Inter, Birthstone, Cinzel, Lora } from 'next/font/google'; // Ya está usando next/font, no requiere cambio aquí

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
});

export const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const birthStone = Birthstone({
  subsets: ['latin'],
  weight: ['400'],
});

export const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400'],
});
