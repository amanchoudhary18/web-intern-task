import "./App.css";
import ManageStaff from "./components/ManageStaff";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1602FF",
    },
    secondary: {
      main: "#AB8484",
    },
    typography: {
      fontFamily: "Roboto",
      fontSize: 24,
      fontWeightRegular: 500,
      fontWeightBold: 500,
    },
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <ManageStaff />
      </div>
    </ThemeProvider>
  );
}

export default App;
