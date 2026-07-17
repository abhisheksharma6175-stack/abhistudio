import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8B5CF6",
    },
    secondary: {
      main: "#EC4899",
    },
    background: {
      default: "#F8F8F8",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },
  },

  typography: {
    fontFamily: "Poppins, sans-serif",

    h1: {
      fontSize: "3rem",
      fontWeight: 700,
    },

    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },

    h3: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },
});

export default theme;