import { useEffect, useState } from "react";

const useDetectOutsideClick = (ref, initialState) => {
  const [isActive, setIsActive] = useState(initialState);

  useEffect(() => {
    const onClick = (event) => {
      if (ref.current !== null && !ref.current.contains(event.target)) {
        // console.log("outside clicked", event.target);
        setIsActive(!isActive);
      }
    };

    if (isActive) {
      window.addEventListener("mousedown", onClick);
    }

    return () => {
      window.removeEventListener("mousedown", onClick);
    };
  }, [isActive, ref]);

  return [isActive, setIsActive];
};

export default useDetectOutsideClick;

//USAGE ->pass ref of the dropdown/popup element with state as true  .
//if its active i.e true then it attaches event listerner of mouse click .
//when mouse click anywhere excpet the dropdown/popup element it closes i.e we  set
//isActive false and after xecuting useEffect clear the listener for performance
