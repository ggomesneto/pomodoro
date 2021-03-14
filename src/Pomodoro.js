import React, { useState, useRef, useEffect } from "react";

import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Pomodoro = () => {
  let times = {
    work: 25 * 60 * 1000,
    rest: 5 * 60 * 1000,
    long: 15 * 60 * 1000,
  };
  const [timeleft, setTimeLeft] = useState(times.work);
  const [count, setCount] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [error, setError] = useState(false);

  var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

  let timerId = useRef();

  const startClock = () => {
    if (!isResting) {
      clearInterval(timerId.current);
      setTimeLeft(times.work);
      setCount(1);
      timerId.current = setInterval(() => {
        setTimeLeft((timeleft) => timeleft - 1000);
      }, 100);
      setError(false);
    } else {
      setError(true);
    }
  };

  const stopClock = () => {
    if (timerId.current) {
      clearInterval(timerId.current);
      setTimeLeft(25 * 60 * 1000);
      timerId.current = undefined;
    }
  };

  if (timeleft === 0) {
    if (isResting) {
      setTimeLeft(times.work);
      setIsResting(false);
      setError(false);
    } else {
      setCount((count) => count + 1);

      if (count === 4) {
        setTimeLeft(times.long);
        setCount(1);
      } else {
        setTimeLeft(times.rest);
      }
    }
  }

  useEffect(() => {
    if (count !== 1) {
      setIsResting(true);
    }
  }, [count]);

  return (
    <div className="pomodoro">
      <CircularProgressbarWithChildren
        value={(100 / 25) * (25 - minutes) - 100 / 25}
      >
        <div className="clock">
          {minutes}:{seconds < 10 ? "0" + seconds : seconds}
          <p>{isResting ? "REST TIME" : "WORK TIME"}</p>
        </div>
        {error ? (
          <div className="error" style={{ color: "red", fontWeight: "bolder" }}>
            CAN'T DO IT!
          </div>
        ) : null}
      </CircularProgressbarWithChildren>

      <div className="start" onClick={startClock}>
        {timerId.current ? "Reset" : "Start"}
      </div>
      <div className="stop" onClick={stopClock}>
        Stop
      </div>
    </div>
  );
};

export default Pomodoro;
