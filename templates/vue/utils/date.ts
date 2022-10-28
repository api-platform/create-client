import dayjs from "dayjs";

const formatDateTime = function (date?: string): string | null {
  if (!date) return null;

  return dayjs(date).format("DD/MM/YYYY");
};

const formatDateInput = function (date?: string): string | null {
  if (!date) return null;

  return dayjs(date).format("YYYY-MM-DD");
};

export { formatDateTime, formatDateInput };
