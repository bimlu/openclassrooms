/**
 * Theme for applying consistent styling to the app
 */

export const lightTheme = {
  body: '#FFF',
  text: '#363537',
  toggleBorder: '#FFF',
  background: '#363537',
};
export const darkTheme = {
  body: '#363537',
  text: '#FAFAFA',
  toggleBorder: '#6B8096',
  background: '#999',
};

export default {
  /**
   * Font
   */
  font: {
    family: "'Open Sans', sans-serif",
    weight: {
      light: '300',
      normal: '400',
      bold: '600',
    },
    size: {
      tiny: '11px',
      xxs: '13px',
      xs: '14px',
      sm: '16px',
      md: '18px',
      lg: '20px',
      xl: '34px',
    },
  },

  /**
   * Colors
   */
  colors: {
    black: '#000000',
    white: '#fff',
    red: '#f00',
    success: '#34a853',
    body: '#fcfbfe',

    primary: {
      light: '#a6d4fa',
      main: '#90caf9',
      dark: '#648dae',
      contrastText: '#000',
    },

    secondary: {
      light: '#ff99bb',
      main: '#ff80ab',
      dark: '#b25977',
      contrastText: '#000',
    },

    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },

    border: {
      light: '#f5f5f5',
      main: '#e0e0e0',
      dark: '#bdbdbd',
    },

    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#fff',
    },

    warning: '#FFB818',

    info: '#4169E1',

    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },

  /**
   * Shadows
   */
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: 'rgba(0, 0, 0, 0.3) 0px 1px 8px 0px',
    lg: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    xl: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  },

  /**
   * Breakpoints
   */
  screen: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },

  /**
   * Spacing
   */
  spacing: {
    none: 0,
    tiny: '3px',
    xxs: '5px',
    xs: '10px',
    sm: '20px',
    md: '30px',
    lg: '40px',
    xl: '60px',
  },

  /**
   * Radius
   */
  radius: {
    sm: '3px',
    md: '6px',
    lg: '12px',
  },

  /**
   * zIndex
   */
  zIndex: {
    xs: 10,
    sm: 20,
    md: 30,
    lg: 40,
    xl: 50,
  },
};
