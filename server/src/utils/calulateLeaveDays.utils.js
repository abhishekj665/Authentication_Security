export const calculateLeaveDays = (startDate, endDate, isHalfDay = false) => {
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required");
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (isNaN(start) || isNaN(end)) {
    throw new Error("Invalid date format");
  }

  if (start > end) {
    throw new Error("Start date cannot be after end date");
  }

  
  if (isHalfDay) {
    if (start.getTime() !== end.getTime()) {
      throw new Error("Half day leave must be for a single date");
    }
    return 0.5;
  }

  const diffTime = end.getTime() - start.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;

  return diffDays;
};
