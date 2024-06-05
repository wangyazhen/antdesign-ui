/*
 * @Author: 王亚振
 * @Date: 2024-06-05 15:31:40
 * @LastEditors: 王亚振
 * @LastEditTime: 2024-06-05 16:44:09
 * @FilePath: /antdesign-ui/components/hooks/useMount.js
 */

import { useEffect } from 'react';

function useMount(callback) {
  useEffect(() => {
    callback();
  }, []);
}

export default useMount;