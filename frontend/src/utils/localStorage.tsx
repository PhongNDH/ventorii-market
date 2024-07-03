export const getItemLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(key);
  return value || null;
};

export const setItemLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
  window.dispatchEvent(new Event('storage'));
};

export const removeItemLocalStorage = (key: string) => {
  localStorage.removeItem(key);
  window.dispatchEvent(new Event('storage'));
};

export const clearLocalStorage = () => {
  localStorage.clear();
  window.dispatchEvent(new Event('storage'));
};
