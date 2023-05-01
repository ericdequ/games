import { useEffect } from "react";

const useAudio = (src) => {
  useEffect(() => {
    if (src) {
      const audio = new Audio(src);
      audio.play();

      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [src]);
};


export default useAudio;