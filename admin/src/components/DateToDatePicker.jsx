import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect } from "react";

export default function DateToDatePicker({ fromDate, toDate, onChange }) {
  useEffect(() => {
    if (toDate.isBefore(fromDate)) {
      onChange({
        fromDate: dayjs().subtract(29, "day"),
        toDate: dayjs(),
      });
    }
  }, [fromDate, onChange, toDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-wrap gap-3">
        <DatePicker
          label="From"
          value={fromDate}
          onChange={(newValue) =>
            newValue && onChange({ fromDate: newValue, toDate })
          }
          slotProps={{ textField: { size: "small" } }}
          format="DD/MM/YYYY"
        />
        <DatePicker
          label="To"
          value={toDate}
          onChange={(newValue) =>
            newValue && onChange({ fromDate, toDate: newValue })
          }
          slotProps={{ textField: { size: "small" } }}
          format="DD/MM/YYYY"
        />
      </div>
    </LocalizationProvider>
  );
}
