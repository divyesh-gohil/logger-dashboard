import * as React from "react";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";

export default function DatePickup({ lable, val, setVal, from, to }) {
  const handleChange = (newValue) => {
    setVal(dayjs(newValue).format("YYYY-MM-DD hh:mm"));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        minDate={from ? new Date(from) : ""}
        maxDate={to ? new Date(to) : ""}
        label={lable}
        inputFormat="YYYY-MM-DD"
        value={val ? val : null}
        onChange={handleChange}
        renderInput={(params) => (
          <>
            <TextField {...params} />
          </>
        )}
      />
    </LocalizationProvider>
  );
}
