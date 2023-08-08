import React, { useState, useEffect, useRef } from "react";
import CategorySelectorWithLocalStorage from "./CategorySelectorWithLocalStorage";

function TimerWithLocalStorage() {

  const [timerDuration, setTimerDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [seconds, setSeconds] = useState(timerDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const beepAudio = useRef(null);

  useEffect(() => {
    beepAudio.current = new Audio("./sound/sound.mp3");
  }, []);

  useEffect(() => {
    if (seconds === 0 && isActive && beepAudio.current) {
      beepAudio.current.play();
    }
  }, [seconds, isActive]);

  useEffect(() => {
    setSeconds(timerDuration * 60);
  }, [timerDuration]);
  useEffect(() => {
    if (isActive && seconds <= 1 && !onBreak) {
      logWorkDuration(timerDuration * 60, selectedCategory);
      setOnBreak(true);
    }
  }, [isActive, seconds, onBreak]);

  const logWorkDuration = (duration, category) => {
    let currentDate = new Date();
    let currentWeekNumber = getCurrentWeekNumber(currentDate);
    let currentYear = currentDate.getFullYear();

    let workLog = JSON.parse(localStorage.getItem("workLog") || "{}");
    if (!workLog[currentYear]) {
      workLog[currentYear] = {};
    }
    if (!workLog[currentYear][currentWeekNumber]) {
      workLog[currentYear][currentWeekNumber] = {};
    }
    workLog[currentYear][currentWeekNumber][category] =
      (workLog[currentYear][currentWeekNumber][category] || 0) + duration;
    localStorage.setItem("workLog", JSON.stringify(workLog));
  };

  const getCurrentWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = (date - startOfYear + 86400000) / 86400000;
    return Math.ceil(dayOfYear / 7);
  };

  useEffect(() => {
    let interval;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (isActive && seconds <= 0) {
      if (onBreak) {
        setSeconds(timerDuration * 60);
        setOnBreak(false);
      } else {
        setSeconds(breakDuration * 60);
        setOnBreak(true);
      }
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, onBreak, timerDuration, breakDuration]);

  useEffect(() => {
    localStorage.setItem("timerDuration", timerDuration);
    localStorage.setItem("breakDuration", breakDuration);
  }, [timerDuration, breakDuration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };


  const handleCategoryChange = (newCategory) => {
    console.log(`Selected Category: ${newCategory}`);
    setSelectedCategory(newCategory);
  };

  return (
    <div className="maincontainer">
      <div className="timer-circle">
        {Math.floor(seconds / 60)}:{("0" + (seconds % 60)).slice(-2)}{" "}
        {onBreak ? "Break" : ""}
      </div>
      <div className="inputcontainer">
      <CategorySelectorWithLocalStorage 
        onCategoryChange={handleCategoryChange} 
        selectedCategory={selectedCategory} 
      />
     
        <input
          type="number"
          placeholder="Set Timer Duration"
          value={timerDuration}
          onChange={(e) => setTimerDuration(Math.max(1, e.target.value))}
        />
        <input
          placeholder="Set Break Duration"
          type="number"
          value={breakDuration}
          onChange={(e) => setBreakDuration(Math.max(1, e.target.value))}
        />
        <button className="start" onClick={toggleTimer}>
        {isActive ? "Pause" : "Start"}
      </button>
      </div>

      
    </div>
  );
}

export default TimerWithLocalStorage;