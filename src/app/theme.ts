import { lora } from '@/utils/fonts/fonts';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    poster: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    poster?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    poster: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: lora.style.fontFamily,
    h1: {
      fontFamily: lora.style.fontFamily,
    },
    h2: {
      fontFamily: lora.style.fontFamily,
    },
    h3: {
      fontFamily: lora.style.fontFamily,
    },
    h4: {
      fontFamily: lora.style.fontFamily,
    },
    h5: {
      fontFamily: lora.style.fontFamily,
    },
    h6: {
      fontFamily: lora.style.fontFamily,
    },
    subtitle1: {
      fontFamily: lora.style.fontFamily,
    },
    subtitle2: {
      fontFamily: lora.style.fontFamily,
    },
    body1: {
      fontFamily: lora.style.fontFamily,
    },
    body2: {
      fontFamily: lora.style.fontFamily,
    },
    button: {
      fontFamily: lora.style.fontFamily,
    },
    caption: {
      fontFamily: lora.style.fontFamily,
    },
    overline: {
      fontFamily: lora.style.fontFamily,
    },
  },
});

export default theme;
