import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    // type: 'dark',
    border: {
      light: '#f5f5f5',
      main: '#e0e0e0',
      dark: '#bdbdbd',
    },
  },

  zIndex: {
    xs: 10,
    sm: 20,
    md: 30,
    lg: 40,
    xl: 50,
  },
});

export default theme;
