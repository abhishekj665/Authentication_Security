import dayjs from "dayjs";

export const localTime = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
};

export const getToday = dayjs().format("YYYY-MM-DD");
