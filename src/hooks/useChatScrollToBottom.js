import { useEffect, useRef } from "react";

const useChatScrollToBottom = (prop) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current?.scrollHeight - scrollRef.current?.clientHeight;
    }
  }, [prop]);

  return scrollRef;
};

export default useChatScrollToBottom;

//USAGE
// const list = [1, 2, 3, 4];

// const elementScrollRef = useChatScrollToBottom(list);
// list.push(8)
// everytime a new element is oushed in arr prop changes abd useEffect is ran so,the element to which ref
// is attached is scrolled to bottm to display the new pushed element .
// list.push(9)
// <div ref={elementScrollRef}></div>;
