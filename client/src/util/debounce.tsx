export const debounce = (
  func: (...args: any) => void,
  delay: number
): ((...args: any[]) => void) => {
  let inDebounce: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
