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
  overrides: {
    MuiTab: {
      root: {
          textTransform: 'initial',
          minWidth: "0 !important",
          minHeight: "0 !important",
          margin: "0 30px 0 0 !important",
          padding: "5px 0 !important",
          fontWeight: 400,
          letterSpacing: 0,
          color: "#333333",
          '&$selected': {
            fontWeight: 700,
          },
      },
      selected: {},
      labelContainer: {
        margin: "0 !important",
        padding: "0 !important",
      },
      label: {
        fontSize: "16px !important",
      },
    },
    MuiFormLabel: {
      root: {
        fontWeight: 400,
        padding: "5px 11px 0",
        marginBottom: "10px",
        '&$focused': {
          color: "#026682"
        }
      },
      focused: {}
    },
    MuiInputLabel: {
      formControl: {
        transform: "translate(0, 15px) scale(1)"
      }
    },
    MuiFormControl: {
      root: {
        marginRight: "30px"
      },
    },
    MuiInput: {
      input: {
        padding: "6px 10px 8px",
        lineHeight: "19px",
        width: "350px"
      },
      underline: {
        "&:hover:not($disabled):not($focused):not($error):before": {
          borderBottom: "2px solid #026682",
        },
        "&:before": {
          borderBottom: "1px solid #026682",
        },
        "&:after": {
          borderBottom: "2px solid #026682",
        }
      },
    },
    MuiFormHelperText: {
      root: {
        marginLeft: "10px"
      }
    }
  },
});