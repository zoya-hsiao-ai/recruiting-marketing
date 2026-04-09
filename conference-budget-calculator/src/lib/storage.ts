import type { Conference } from "./types";

const STORAGE_KEY = "conference-dri-hub-data";

export function loadConferences(): Conference[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveConferences(conferences: Conference[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conferences));
}

export function exportData(): string {
  return JSON.stringify(loadConferences(), null, 2);
}

export function importData(json: string): Conference[] {
  const data = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error("Invalid data format");
  saveConferences(data);
  return data;
}
