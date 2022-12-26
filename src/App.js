import "./App.css";
import TableData from "./Screens/TableData";
import { Routes, Route } from "react-router-dom";

export default function App() {
  // const queryString = window.location.search;
  // console.log(queryString);
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<TableData />} />
        <Route exact path="/:id" element={<TableData />} />
      </Routes>
    </div>
  );
}
