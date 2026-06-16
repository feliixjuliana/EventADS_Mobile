export function parseEventDateTime(event) {
  const date = parseDate(event?.date);
  const time = parseTime(event?.time);

  if (!date) return Number.MAX_SAFE_INTEGER;

  date.setHours(time.hour, time.minute, 0, 0);
  return date.getTime();
}

export function sortEventsBySchedule(events) {
  return [...events].sort((a, b) => parseEventDateTime(a) - parseEventDateTime(b));
}

export function getNextUpcomingEvent(events, now = Date.now()) {
  return sortEventsBySchedule(events).find((event) => parseEventDateTime(event) >= now) || null;
}

export function filterUpcomingEvents(events, now = Date.now()) {
  return sortEventsBySchedule(events).filter((event) => parseEventDateTime(event) >= now);
}

export function getEventNotificationDate(event) {
  const timestamp = parseEventDateTime(event);
  if (!Number.isFinite(timestamp) || timestamp === Number.MAX_SAFE_INTEGER) return null;
  return new Date(timestamp);
}

function parseDate(value) {
  if (!value) return null;
  const [day, month, year] = String(value).split("/").map(Number);
  if (!day || !month || !year) return null;

  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
}

function parseTime(value) {
  if (!value) return { hour: 0, minute: 0 };
  const normalized = String(value).replace("h", ":");
  const [hour, minute] = normalized.split(":").map(Number);

  return {
    hour: Number.isFinite(hour) ? hour : 0,
    minute: Number.isFinite(minute) ? minute : 0,
  };
}
