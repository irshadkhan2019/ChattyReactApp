import { useEffect, useState } from "react";

const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounceValue(value), delay || 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounceValue;
};

export default useDebounce;

//USAGE while searching user we dont wont to make api calls
//for every keypress instead we will wait for delay specified
//after the last keypress and then make api call  to get user .

//eg .
// const search = " "; //changes every keypress
// const debounce = useDebounce(search, 5000);

//evry time search changes ,value changes in useEffect if b4 5 sec a new value
// comes then prev timeer is cleared and it will again wait for 5 sec b4
// maing api call :)
