import { createTheme } from '@mui/material/styles';

/**
 * Design tokens from Pencil design file.
 * Exported for use in components that need raw values.
 */
export const tokens = {
  bgPage: '#0C0C0C',
  bgSidebar: '#080808',
  bgCard: '#0A0A0A',
  bgElevated: '#141414',
  bgSubtle: '#1A1A1A',
  border: '#2f2f2f',
  borderLight: '#3f3f3f',
  greenPrimary: '#00FF88',
  greenTint10: '#00FF8810',
  greenTint20: '#00FF8820',
  greenTint40: '#00FF8840',
  orangePrimary: '#FF8800',
  orangeTint20: '#FF880020',
  redError: '#FF4444',
  white: '#FFFFFF',
  gray400: '#6a6a6a',
  gray500: '#8a8a8a',
  blackOnAccent: '#0C0C0C',
} as const;

const fontHeading = '"Space Grotesk", "Roboto", "Helvetica", sans-serif';
const fontMono = '"JetBrains Mono", "Fira Code", monospace';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: tokens.greenPrimary,
      contrastText: tokens.blackOnAccent,
    },
    secondary: {
      main: tokens.orangePrimary,
    },
    error: {
      main: tokens.redError,
    },
    background: {
      default: tokens.bgPage,
      paper: tokens.bgCard,
    },
    text: {
      primary: tokens.white,
      secondary: tokens.gray500,
      disabled: tokens.gray400,
    },
    divider: tokens.border,
  },
  typography: {
    fontFamily: fontMono,
    h1: { fontFamily: fontHeading, fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontFamily: fontHeading, fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: fontHeading, fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontFamily: fontHeading, fontWeight: 700 },
    h5: { fontFamily: fontHeading, fontWeight: 700 },
    h6: { fontFamily: fontHeading, fontWeight: 700 },
    button: { fontFamily: fontMono, fontWeight: 700, letterSpacing: '0.05em' },
    caption: { fontFamily: fontMono, fontSize: '0.6875rem', letterSpacing: '0.05em' },
    overline: { fontFamily: fontMono, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em' },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.bgPage,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 700,
          fontFamily: fontMono,
          letterSpacing: '0.05em',
        },
        containedPrimary: {
          color: tokens.blackOnAccent,
          '&:hover': {
            backgroundColor: '#00cc6e',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${tokens.border}`,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontFamily: fontMono,
            fontSize: '0.8125rem',
            backgroundColor: tokens.bgElevated,
            '& fieldset': {
              borderColor: tokens.border,
            },
            '&:hover fieldset': {
              borderColor: tokens.borderLight,
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: fontMono,
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: fontMono,
          fontSize: '0.625rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          height: 22,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: tokens.border,
          fontFamily: fontMono,
        },
        head: {
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: tokens.gray500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: tokens.bgCard,
          border: `1px solid ${tokens.border}`,
        },
      },
    },
  },
});
