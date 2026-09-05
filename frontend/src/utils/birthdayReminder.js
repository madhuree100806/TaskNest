import { showNotification } from "./notifications";

const STORAGE_KEY = "tasknest_birthday_reminders";

function getStoredReminders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveStoredReminders(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getNextBirthday(dateStr, now = new Date()) {
  if (!dateStr) return null;

  const parts = dateStr.split("-").map(Number);

  if (
    parts.length !== 3 ||
    parts.some((part) => Number.isNaN(part))
  ) {
    return null;
  }

  const [, month, day] = parts;

  const next = new Date(
    now.getFullYear(),
    month - 1,
    day
  );

  next.setHours(0, 0, 0, 0);

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  if (next < today) {
    next.setFullYear(next.getFullYear() + 1);
  }

  return next;
}

export function checkBirthdayReminders(birthdays) {
  const now = new Date();
  const notified = getStoredReminders();

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  birthdays.forEach((birthday) => {
    const birthdayDate = getNextBirthday(birthday.date, now);

    if (!birthdayDate) return;

    const reminderDate = new Date(birthdayDate);

    // Reminder is 1 day before
    reminderDate.setDate(reminderDate.getDate() - 1);
    reminderDate.setHours(0, 0, 0, 0);

    const reminderId = `${birthday.id}-${birthdayDate.getFullYear()}`;

    if (
      today.getTime() === reminderDate.getTime() &&
      !notified[reminderId]
    ) {
      showNotification(
        ` ${birthday.name}'s birthday tomorrow!`,
        {
          body: `Don't forget ${birthday.name}'s birthday tomorrow.`,
        }
      );

      notified[reminderId] = true;
    }
  });

  saveStoredReminders(notified);
}