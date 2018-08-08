import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
  shape: {
    borderRadius: 2
  },
  palette: {
    common: {
      black: "#333333",
      white: "#ffffff"
    },
    primary: {
      main: "#026682"
    },
    secondary: {
      main: "#d8ab4c"
    }
  },
  typography: {
    button: {
      fontSize: "14px",
      textTransform: "uppercase",
      fontWeight: 500,
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      color: "#333333",
      letterSpacing: "0.9px"
    }
  },
});