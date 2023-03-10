import { useCallback, useEffect } from "react";

const useInfiniteScroll = (bodyRef, bottomLineRef, callback) => {
  console.log("ScROLLLLL", bodyRef.current, bottomLineRef.current);

  const handleScroll = useCallback(() => {
    const containerHeight = bodyRef?.current?.getBoundingClientRect().height;
    const { top: bottomLineTop } =
      bottomLineRef?.current?.getBoundingClientRect();

    // console.log("Current bodyRef ht", containerHeight);
    // console.log("Current bottomLineRef ht", bottomLineTop);

    if (bottomLineTop <= containerHeight) {
      //when we reach bottomlienref we call our api to fetch new posts
      console.log("REACHED BOTTOM fetching new data");
      callback();
    }
  }, [bodyRef, bottomLineRef, callback]);

  useEffect(() => {
    const bodyRefCurrent = bodyRef?.current;
    //attach event listener to bodyref

    console.log("Adding Scroll event listener");
    bodyRefCurrent?.addEventListener("scroll", handleScroll, true);

    return () => {
      //detach event listerner if not scrolling
      console.log("REMoving Scroll event listener");
      bodyRefCurrent.removeEventListener("scroll", handleScroll, true);
    };
  }, [bodyRef, handleScroll]);
};

export default useInfiniteScroll;

// USAGE;
// <div ref={bodyref}> //scroll event attched here , so height increses when we scroll  .
//   ----- posts
//   ----- posts ...
//   -----
//   <div ref={bottomLineRef}></div> //when bodyref scroll ht becomes equal to this element ht , we make api call and add more posts .
//                                   //when new posts are added above again this ht increases  and we scroll to repeat ...
// </div>
