import dayjs from "dayjs";

export function formatDateTime(date?: string): string | null {
  if (!date) return null;

  return dayjs(date).format("DD/MM/YYYY");
}

export function formatDateInput(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  return dayjs(value).format("YYYY-MM-DD");
}
