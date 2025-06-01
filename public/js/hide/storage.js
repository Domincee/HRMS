// storage.js

const STORAGE_KEY = 'employees';

export function saveEmployees(employees) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

export function loadEmployees() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved employees:', e);
      return null;
    }
  }
  return null;
}

export function clearEmployees() {
  localStorage.removeItem(STORAGE_KEY);
}
