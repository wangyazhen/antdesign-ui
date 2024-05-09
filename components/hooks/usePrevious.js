import { useEffect, useRef } from 'react';

function usePrevious(value) {
    // 创建一个 useRef，用于存储上一次渲染时的值
    const ref = useRef();

    // 使用 useEffect，在组件更新后将当前值存储在 ref.current 中
    useEffect(() => {
        ref.current = value;
    }, [value]); // 每次 value 变化时触发 effect

    // 返回上一次渲染时存储的值
    return ref.current;
}

export default usePrevious;
