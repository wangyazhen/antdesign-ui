/*
 * @Author: 王亚振
 * @Date: 2024-05-20 15:01:49
 * @LastEditors: 王亚振
 * @LastEditTime: 2024-06-05 15:22:38
 * @FilePath: /antdesign-ui/components/hooks/useDebounce.js
 */
import { useCallback, useRef } from 'react';


function useDebounce(func, wait) {
  const timeoutRef = useRef(null);

  const debouncedFunction = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, wait);
  }, [func, wait]);

  return debouncedFunction;
}

export default useDebounce;
