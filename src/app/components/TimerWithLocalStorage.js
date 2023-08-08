import React, { useState, useEffect, useRef } from "react";
import CategorySelectorWithLocalStorage from "./CategorySelectorWithLocalStorage";
import useLocalStorageState from 'use-local-storage-state';

function TimerWithLocalStorage() {
  const [timerDuration, setTimerDuration] = useLocalStorageState('timerDuration', 25);
  const [breakDuration, setBreakDuration] = useLocalStorageState('breakDuration', 5);
  const [seconds, setSeconds] = useState(timerDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [workLog, setWorkLog] = useLocalStorageState('workLog', {});
  const beepAudio = useRef(null);

  function getCurrentWeekNumber() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / (7 * 24 * 60 * 60 * 1000)));
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const updateWorkLog = () => {
    if (onBreak) return;

    const currentYear = new Date().getFullYear();
    const currentWeek = getCurrentWeekNumber();

    const savedWorkLog = { ...workLog };
    const yearData = savedWorkLog[currentYear] || {};
    const weekData = yearData[currentWeek] || {};
    
    weekData[selectedCategory] = (weekData[selectedCategory] || 0) + timerDuration * 60;
    yearData[currentWeek] = weekData;
    savedWorkLog[currentYear] = yearData;

    setWorkLog(savedWorkLog);
  }

  useEffect(() => {
    beepAudio.current = new Audio("./sound/sound.mp3");
  }, []);

  useEffect(() => {
    if (seconds === 0 && isActive && beepAudio.current) {
        beepAudio.current.play();
        updateWorkLog();
        setOnBreak(!onBreak);
        setSeconds(onBreak ? timerDuration * 60 : breakDuration * 60);    
    }
  }, [seconds, isActive, timerDuration, breakDuration, onBreak]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
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
          onChange={(e) => {
            const newDuration = Math.max(1, e.target.value);
            setTimerDuration(newDuration);
            setSeconds(newDuration * 60);
          }}
        />
        <input
          placeholder="Set Break Duration"
          type="number"
          value={breakDuration}
          onChange={(e) => {
            const newBreakDuration = Math.max(1, e.target.value);
            setBreakDuration(newBreakDuration);
            if (onBreak) setSeconds(newBreakDuration * 60);
          }}
        />
        <button className="start" onClick={toggleTimer}>
          {isActive ? "Break" : "Start"}
        </button>
      </div>
    </div>
  );
}

export default TimerWithLocalStorage;
