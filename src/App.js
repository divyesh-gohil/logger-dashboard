import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import "./App.css";
import TableComponent from "./Screens/TableData";

export default function App() {
  return (
    <div>
      <Box
        sx={{ width: "100%", m: 2 }}
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
      >
        <Typography style={{ fontweight: 600 }} p={2}>
          Logger Dashboard
        </Typography>
      </Box>
      <TableComponent />
    </div>
  );
}
