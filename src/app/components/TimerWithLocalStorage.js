import React, { useState, useEffect } from 'react';

function TimerWithLocalStorage({ selectedCategory }) {
    const [timerDuration, setTimerDuration] = useState();
    const [breakDuration, setBreakDuration] = useState();
    const [seconds, setSeconds] = useState(timerDuration * 60);
    const [isActive, setIsActive] = useState(false);
    const [onBreak, setOnBreak] = useState(false);

    useEffect(() => {
        setSeconds(timerDuration * 60);
    }, [timerDuration]);

    useEffect(() => {
        if (isActive && seconds <= 0 && !onBreak) {
            logWorkDuration(timerDuration * 60, selectedCategory);
            setOnBreak(true);
        }
    }, [isActive, seconds, onBreak]);

    const logWorkDuration = (duration, category) => {
        let currentDate = new Date();
        let currentWeekNumber = getCurrentWeekNumber(currentDate);
        let currentYear = currentDate.getFullYear();

        let workLog = JSON.parse(localStorage.getItem('workLog') || '{}');
        if (!workLog[currentYear]) {
            workLog[currentYear] = {};
        }
        if (!workLog[currentYear][currentWeekNumber]) {
            workLog[currentYear][currentWeekNumber] = {};
        }
        workLog[currentYear][currentWeekNumber][category] = (workLog[currentYear][currentWeekNumber][category] || 0) + duration;
        localStorage.setItem('workLog', JSON.stringify(workLog));
    };

    const getCurrentWeekNumber = (date) => {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const dayOfYear = ((date - startOfYear + 86400000) / 86400000);
        return Math.ceil(dayOfYear / 7);
    };

    useEffect(() => {
        let interval;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
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
        localStorage.setItem('timerDuration', timerDuration);
        localStorage.setItem('breakDuration', breakDuration);
    }, [timerDuration, breakDuration]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    return (
        <div>
            <div>
                
                <input
                    type="number"
                    placeholder='Set Timer Duration'
                    value={timerDuration}
                    onChange={e => setTimerDuration(Math.max(1, e.target.value))}
                />
            </div>
            <div>

                <input
                placeholder='Set Break Duration'
                    type="number"
                    value={breakDuration}
                    onChange={e => setBreakDuration(Math.max(1, e.target.value))}
                />
            </div>
            <div className="timer-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="210" height="210" viewBox="0 0 210 210" fill="none">
    <circle cx="105" cy="105" r="102.5" fill="#1C85D1" stroke="white" stroke-width="5"/>
    <text fill="#FFF" 
          x="50%" 
          y="50%" 
          text-anchor="middle" 
          dy=".3em" 
          font-family="Inter" 
          font-size="35px" 
          font-weight="400">
        {Math.floor(seconds / 60)}:{("0" + (seconds % 60)).slice(-2)} {onBreak ? 'Break' : 'Work'}
    </text>
</svg>

</div>

            <button onClick={toggleTimer}>
                {isActive ? 'Pause' : 'Start'}
            </button>
        </div>
    );
}

export default TimerWithLocalStorage;
