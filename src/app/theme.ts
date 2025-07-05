import { goudi } from '@/utils/fonts/fonts';
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
    fontFamily: goudi.style.fontFamily,
    h1: {
      fontFamily: goudi.style.fontFamily,
    },
    h2: {
      fontFamily: goudi.style.fontFamily,
    },
    h3: {
      fontFamily: goudi.style.fontFamily,
    },
    h4: {
      fontFamily: goudi.style.fontFamily,
    },
    h5: {
      fontFamily: goudi.style.fontFamily,
    },
    h6: {
      fontFamily: goudi.style.fontFamily,
    },
    subtitle1: {
      fontFamily: goudi.style.fontFamily,
    },
    subtitle2: {
      fontFamily: goudi.style.fontFamily,
    },
    body1: {
      fontFamily: goudi.style.fontFamily,
    },
    body2: {
      fontFamily: goudi.style.fontFamily,
    },
    button: {
      fontFamily: goudi.style.fontFamily,
    },
    caption: {
      fontFamily: goudi.style.fontFamily,
    },
    overline: {
      fontFamily: goudi.style.fontFamily,
    },
  },
});

export default theme;
