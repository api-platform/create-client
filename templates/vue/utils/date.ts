import dayjs from "dayjs";

const formatDateTime = (date?: string): string | null => {
  if (!date) return null;

  return dayjs(date).format("DD/MM/YYYY");
};

const formatDateInput = (date?: string): string | undefined => {
  if (!date) return undefined;

  return dayjs(date).format("YYYY-MM-DD");
};

export { formatDateTime, formatDateInput };
