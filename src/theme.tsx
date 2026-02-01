import { createTheme, type ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string;
      secondary: string;
      call: string;
    };
  }
  interface PaletteOptions {
    gradient?: {
      primary: string;
      secondary: string;
      call: string;
    };
  }
}

const getTheme = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#3F51B5',
      dark: '#303F9F',
      light: '#5C6BC0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#42A5F5',
      dark: '#1E88E5',
      light: '#90CAF9',
      contrastText: '#FFFFFF',
    },
    background: {
      default: mode === 'light' ? '#FAFAFA' : '#111827',
      paper: mode === 'light' ? '#FFFFFF' : '#1F2937',
    },
    text: {
      primary: mode === 'light' ? '#212121' : '#FFFFFF',
      secondary: mode === 'light' ? '#757575' : '#9CA3AF',
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #3F51B5 0%, #5C6BC0 50%, #42A5F5 100%)',
      secondary: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
      call: 'linear-gradient(135deg, #3F51B5 0%, #303F9F 50%, #1A237E 100%)',
    },
    success: {
      main: '#10B981',
      dark: '#059669',
      light: '#34D399',
    },
    error: {
      main: '#EF4444',
      dark: '#DC2626',
      light: '#F87171',
    },
    warning: {
      main: '#F59E0B',
      dark: '#D97706',
      light: '#FBBF24',
    },
    info: {
      main: '#3B82F6',
      dark: '#2563EB',
      light: '#60A5FA',
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  // shadows: [
  //   'none',
  //   '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  //   '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  //   '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  //   '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  //   '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  //   '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  //   '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  //   '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  //   '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  //   '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  //   '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  //   '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  //   '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  //   '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  //   '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  //   '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  //   '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  //   '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  //   '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  //   '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  //   '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  //   '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  //   '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  //   '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  //   '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  // ],
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.05)',
    '0 1px 3px rgba(0,0,0,0.1)',
    '0 4px 6px rgba(0,0,0,0.1)',
    '0 10px 15px rgba(0,0,0,0.1)',
    '0 20px 25px rgba(0,0,0,0.1)',
    '0 25px 50px rgba(0,0,0,0.25)',
    ...Array(18).fill('0 1px 2px rgba(0,0,0,0.05)'),
  ] as ThemeOptions['shadows'],

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '10px 24px',
        },
        containedPrimary: {
          boxShadow: '0 4px 6px -1px rgba(63, 81, 181, 0.3)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(63, 81, 181, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => createTheme(getTheme(mode));

export const sentMessageBg = '#E8EAF6';
export const receivedMessageBg = '#FFFFFF';
export const indigoLight = '#E8EAF6';
