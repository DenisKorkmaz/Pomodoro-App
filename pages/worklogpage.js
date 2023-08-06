import React, { useState, useEffect } from 'react';
import Link from 'next/link';


function getCurrentWeekNumber(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = ((date - startOfYear + 86400000) / 86400000);
    return Math.ceil(dayOfYear / 7);
}

function getWeekRange(weekNumber, year) {
    const startOfYear = new Date(year, 0, 1);
    const startOfWeek = new Date(startOfYear);
    startOfWeek.setDate(startOfYear.getDate() + (weekNumber - 1) * 7);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return {
        start: `${startOfWeek.getDate()}.${startOfWeek.getMonth() + 1}`,
        end: `${endOfWeek.getDate()}.${endOfWeek.getMonth() + 1}`
    };
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    let timeStr = '';
    if (hours > 0) timeStr += `${hours} hour${hours > 1 ? 's' : ''} `;
    if (minutes > 0) timeStr += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return timeStr.trim();
}

function WorkLogPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [workLog, setWorkLog] = useState({});
    const [allCategories, setAllCategories] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('workLog') || '{}');
        const savedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
        setWorkLog(data);
        setAllCategories(savedCategories);
    }, []);

    const currentDate = new Date();
    const currentWeekNumber = getCurrentWeekNumber(currentDate);
    const currentYear = currentDate.getFullYear();
    const weekRange = getWeekRange(currentWeekNumber, currentYear);

    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/worklogpage">Work Log</Link>
                    </li>
                </ul>
            </nav>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                <option value="all">All Categories</option>
                {allCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>
            
            <h1 className="date-info">Your Work Log for CW {currentWeekNumber} ({weekRange.start} - {weekRange.end})</h1>
        
            
         

            <ul>
                {
                    Object.keys(workLog[currentYear] && workLog[currentYear][currentWeekNumber] || {}).map(category => {
                        if (selectedCategory === 'all' || selectedCategory === category) {
                            const timeWorked = workLog[currentYear][currentWeekNumber][category];
                            return <li key={category}>You worked {formatTime(timeWorked)} on {category} this week.</li>;
                        }
                        return null;
                    })
                }
            </ul>
        </div>
    );
}

export default WorkLogPage;
