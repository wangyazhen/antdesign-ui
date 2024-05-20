/*
 * @Author: 王亚振
 * @Date: 2024-05-20 15:01:49
 * @LastEditors: 王亚振
 * @LastEditTime: 2024-05-20 15:03:15
 * @FilePath: /antdesign-ui/components/hooks/useDebounce.js
 */
import { useState } from 'react';

function useDebounce(func, delay) {
  const [timerId, setTimerId] = useState(null);

  return function (...args) {
    clearTimeout(timerId);
    const newTimerId = setTimeout(() => {
      func(...args);
    }, delay);
    setTimerId(newTimerId);
  };
}

export default useDebounce;
