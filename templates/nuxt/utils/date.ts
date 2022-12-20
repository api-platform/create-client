import dayjs from "dayjs";

export function formatDateTime(date?: string): string | null {
  if (!date) return null;

  return dayjs(date).format("DD/MM/YYYY");
}

export function formatDateInput(date?: string): string | undefined {
  if (!date) return undefined;

  return dayjs(date).format("YYYY-MM-DD");
}
