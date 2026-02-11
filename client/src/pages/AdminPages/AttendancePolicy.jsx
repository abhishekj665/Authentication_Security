import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Box,
  Paper,
  Chip,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const weekendDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const initialForm = {
  shiftType: "SAMEDAY",
  isDefault: false,
  startTime: "",
  endTime: "",
  breakTime: "",
  gracePunchInTime: "",
  gracePunchOutTime: "",
  graceHalfDayMinute: "",
  graceAbsentMinute: "",
  graceLateMinute: "",
  weekends: [],
  overtimeEnable: false,
  overtimeHours: "",
  overtimeMinutes: "",
};

export default function AttendancePolicyDialog({ onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const setTime = (key, value) =>
    update(key, value ? value.format("HH:mm") : "");

  const timeValue = (t) => (t ? dayjs(`2020-01-01T${t}`) : null);

  const toggleWeekend = (d) => {
    const s = new Set(form.weekends);
    s.has(d) ? s.delete(d) : s.add(d);
    update("weekends", [...s]);
  };

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setSubmitting(false);
    }
  }, [open]);

  const section = (title, desc, children) => (
    <Paper className="p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
      <div>
        <Typography fontWeight={600}>{title}</Typography>
        <Typography variant="body2" className="text-gray-500">
          {desc}
        </Typography>
      </div>
      {children}
    </Paper>
  );

  const handleSubmit = async () => {
    setSubmitting(true);

    const attendancePayload = {
      shiftType: form.shiftType,
      isDefault: form.isDefault,
      startTime: form.startTime,
      endTime: form.endTime,
      breakTime: form.breakTime || null,
      gracePunchInTime: form.gracePunchInTime || null,
      gracePunchOutTime: form.gracePunchOutTime || null,
      graceHalfDayMinute: Number(form.graceHalfDayMinute || 0),
      graceAbsentMinute: Number(form.graceAbsentMinute || 0),
      graceLateMinute: Number(form.graceLateMinute || 0),
      weekends: form.weekends,
    };

    const overtimePayload = {
      enable: form.overtimeEnable,
      overtimeHours: form.overtimeHours || null,
      overtimeMinutes: Number(form.overtimeMinutes || 0),
    };

    await onSubmit({ attendancePayload, overtimePayload });
    setSubmitting(false);
  };

  return (
    <>
      <Button
        variant="contained"
        style={{ margin: "16px" }}
        color="primary"
        onClick={() => setOpen(true)}
      >
        Create Attendance Policy
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle className="text-2xl font-bold">
          Create Attendance Policy
          <Typography variant="body2" className="text-gray-500 mt-2">
            Configure shift, grace limits, weekends, and overtime rules
          </Typography>
        </DialogTitle>

        <DialogContent className="space-y-6 mt-4 bg-gray-50 p-6">
          {section(
            "Shift Configuration",
            "Define working hours and shift type",
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextField
                select
                label="Shift Type"
                value={form.shiftType}
                onChange={(e) => update("shiftType", e.target.value)}
                size="small"
                fullWidth
              >
                <MenuItem value="SAMEDAY">Same Day</MenuItem>
                <MenuItem value="OVERNIGHT">Overnight</MenuItem>
              </TextField>

              <Box className="flex items-center h-14">
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isDefault}
                      onChange={(e) => update("isDefault", e.target.checked)}
                    />
                  }
                  label="Default Policy"
                />
              </Box>

              <TimePicker
                label="Start Time"
                value={timeValue(form.startTime)}
                onChange={(v) => setTime("startTime", v)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />

              <TimePicker
                label="End Time"
                value={timeValue(form.endTime)}
                onChange={(v) => setTime("endTime", v)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />

              <TimePicker
                label="Break Duration"
                value={timeValue(form.breakTime)}
                onChange={(v) => setTime("breakTime", v)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Box>,
          )}

          {section(
            "Grace Rules",
            "Tolerance before late / half-day / absent",
            <Box className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <TimePicker
                label="Punch-In Grace"
                value={timeValue(form.gracePunchInTime)}
                onChange={(v) => setTime("gracePunchInTime", v)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />

              <TimePicker
                label="Punch-Out Grace"
                value={timeValue(form.gracePunchOutTime)}
                onChange={(v) => setTime("gracePunchOutTime", v)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />

              <TextField
                label="Late Grace (min)"
                type="number"
                size="small"
                inputProps={{ min: 0 }}
                value={form.graceLateMinute}
                onChange={(e) => update("graceLateMinute", e.target.value)}
              />

              <TextField
                label="Half Day Grace (min)"
                type="number"
                size="small"
                inputProps={{ min: 0 }}
                value={form.graceHalfDayMinute}
                onChange={(e) => update("graceHalfDayMinute", e.target.value)}
              />

              <TextField
                label="Absent Grace (min)"
                type="number"
                size="small"
                inputProps={{ min: 0 }}
                value={form.graceAbsentMinute}
                onChange={(e) => update("graceAbsentMinute", e.target.value)}
              />
            </Box>,
          )}

          {section(
            "Weekends",
            "Select non-working days",
            <Box className="flex flex-wrap gap-2">
              {weekendDays.map((d) => (
                <Chip
                  key={d}
                  label={d}
                  clickable
                  color={form.weekends.includes(d) ? "primary" : "default"}
                  variant={form.weekends.includes(d) ? "filled" : "outlined"}
                  onClick={() => toggleWeekend(d)}
                />
              ))}
            </Box>,
          )}

          {section(
            "Overtime",
            "Enable and limit overtime",
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.overtimeEnable}
                    onChange={(e) => update("overtimeEnable", e.target.checked)}
                  />
                }
                label="Enable Overtime"
              />

              <Box className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TimePicker
                  label="Overtime Starts After"
                  disabled={!form.overtimeEnable}
                  value={timeValue(form.overtimeHours)}
                  onChange={(v) => setTime("overtimeHours", v)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />

                <TextField
                  label="Max Overtime Minutes"
                  type="number"
                  size="small"
                  inputProps={{ min: 0 }}
                  disabled={!form.overtimeEnable}
                  value={form.overtimeMinutes}
                  onChange={(e) => update("overtimeMinutes", e.target.value)}
                />
              </Box>
            </>,
          )}
        </DialogContent>

        <DialogActions className="p-4 bg-white">
          <Button onClick={() => setOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={true}>
            {submitting ? "Saving..." : "Create Policy"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
