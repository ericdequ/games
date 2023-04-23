import React from "react";
import { Wheel } from "react-custom-roulette";
import { data } from "./wheelData";
import styles from "../../styles/RoulletteWheel.module.css";

const RouletteWheel = ({ onStopSpinning }) => {
  const handleSpinComplete = (winningNumber) => {
    onStopSpinning(winningNumber);
  };

  return (
    <Wheel
      className={styles.wheel}
      segments={data}
      onFinished={(event) => handleSpinComplete(event.segment.number)}
      primaryColor="white"
      secondaryColor="lightgray"
      textColor="black"
      fontSize="18"
      outerBorderColor="black"
      outerBorderWidth="2"
      innerBorderColor="black"
      innerBorderWidth="1"
      radiusLineColor="black"
      radiusLineWidth="2"
      centerX={300}
      centerY={300}
      size={600}
    />
  );
};

export default RouletteWheel;