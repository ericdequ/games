import { useEffect } from "react";

const useArrowKeys = (callback) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        callback(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [callback]);
};

export default useArrowKeys;
