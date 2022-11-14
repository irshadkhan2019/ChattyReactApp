import { useEffect, useRef } from "react";

const useEffectOnce = (callback) => {
  const calledOnce = useRef(false);

  useEffect(() => {
    if (!calledOnce.current) {
      callback();
      calledOnce.current = true;
    }
  }, [callback]);
};

export default useEffectOnce;

// USAGE:WE dont want to call out api multiple times since our component may be re rendered multiple times
// due to change in props or dependencies  .
