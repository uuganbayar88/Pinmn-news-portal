const ULAANBAATAR_TZ = "Asia/Ulaanbaatar";

/**
 * Formats an ISO 8601 timestamp as "yyyy.MM.dd · HH:mm · N мин унших", pinned
 * to Asia/Ulaanbaatar so static output is identical regardless of the build
 * machine's local timezone.
 */
export function formatWhen(iso: string, readMinutes: number): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ULAANBAATAR_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}.${get("month")}.${get("day")} · ${get("hour")}:${get("minute")} · ${readMinutes} мин унших`;
}
