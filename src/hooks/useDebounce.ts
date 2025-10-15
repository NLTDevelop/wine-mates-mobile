import { useCallback, useRef } from "react";

export const useDebounce = (callback: Function, delay: number) => {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
    const debouncedWrapper = useCallback(
      (...args: any[]) => {
        if (timer.current) {
          clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
          callback(...args);
        }, delay);
      },
      [callback, delay],
    );
  
    const cancelDebounce = () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  
    return { debouncedWrapper, cancelDebounce };
  };
  