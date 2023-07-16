import { createTheming } from "react-color-theme";

export const [ThemeProvider, useTheme, themes] = createTheming(
  {
  

   
    primary: "#",
    secondary: "#",
   

    white: "#",
    border:"#"
  },
  {
    dark: {
      background: "#3e3e4a",
      button:"#6fb26f",
      buttonText:"#fcfcfc",
      buttonSecond:"",
      text: "#fcfcfc",
      overlay: "##4E4E5D",
      main: "#",
      status:"dark-content"
    },
    light: {
      background: "#ececec",
      button:"#3e3e4a",
      buttonText:"#fcfcfc",
      buttonSecond:"#6fb26f",
      text: "#3e3e4a",
      textSecond: "#4E4E5D",
      overlay: "#fcfcfc",
      main: "#509777",
      status:"dark-content"
    },
  }
);
