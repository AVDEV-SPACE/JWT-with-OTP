import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Funcție pentru combinarea claselor Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Funcție de criptare a cheii
export function encryptKey(key: string): string {
  return btoa(key); // Codifică în Base64
}

// Funcție de decriptare a cheii
export function decryptKey(encryptedKey: string): string {
  try {
    return atob(encryptedKey); // Decodifică din Base64
  } catch (error) {
    console.error("Eroare la decriptare:", error);
    return "";
  }
}

export function formatDateTime(dateString: string | Date) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateString);
    return { date: "Invalid date", time: "Invalid time", dateTime: "Invalid date & time" };
  }

  const optionsDate: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
  const optionsTime: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: false };

  const formattedDate = date.toLocaleDateString("en-US", optionsDate);
  const formattedTime = date.toLocaleTimeString("en-US", optionsTime);

  return {
    date: formattedDate,
    time: formattedTime,
    dateTime: `${formattedDate} - ${formattedTime}`,
  };
}

export function convertFileToUrl(file: File): string {
  return URL.createObjectURL(file);
}