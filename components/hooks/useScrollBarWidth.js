/*
 * @Author: 王亚振
 * @Date: 2024-05-20 15:13:07
 * @LastEditors: 王亚振
 * @LastEditTime: 2024-05-20 15:25:17
 * @FilePath: /antdesign-ui/components/hooks/useScrollBarWidth.js
 */
import { useState, useEffect } from 'react';
import { getScrollbarWidth } from '../utils/helper';

function useScrollbarWidth() {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    // 计算滚动条宽度
    const width = getScrollbarWidth();
    setScrollbarWidth(width);
  }, []);

  return scrollbarWidth;
}

export default useScrollbarWidth;
