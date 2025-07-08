import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";

export default function DateToDatePicker() {
  const [fromDate, setFromDate] = useState(dayjs().subtract(7, "day"));
  const [toDate, setToDate] = useState(dayjs());
  useEffect(() => {
    if (toDate.isBefore(fromDate)) {
      setFromDate(dayjs().subtract(7, "day"))
      setToDate(dayjs())
    }
  }, [fromDate, toDate])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex gap-5">
        <DatePicker
          label="From"
          value={fromDate}
          onChange={(newValue) => setFromDate(newValue)}
          slotProps={{ textField: { size: "small" } }}
          format="DD/MM/YYYY"
        />
        <DatePicker
          label="To"
          value={toDate}
          onChange={(newValue) => setToDate(newValue)}
          slotProps={{ textField: { size: "small" } }}
          format="DD/MM/YYYY"
        />
      </div>
    </LocalizationProvider>
  );
}
