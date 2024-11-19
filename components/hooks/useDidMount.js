import React, { useRef, useEffect } from 'react';

function useDidMount(callback, deps = []) {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      callback();
    } else {
      didMount.current = true;
    }
  }, deps);
}

export default useDidMount;