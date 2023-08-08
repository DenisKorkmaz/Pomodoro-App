import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WorkLogPage() {
  const [workLog, setWorkLog] = useState({});

  useEffect(() => {
    const savedWorkLog = JSON.parse(localStorage.getItem('workLog')) || {};
    setWorkLog(savedWorkLog);
  }, []);

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
      <h1>Your Work Log</h1>
      {Object.entries(workLog).map(([year, data]) => (
        <div key={year}>
          <h2>Year: {year}</h2>
          {Object.entries(data).map(([week, weekData]) => (
            <div key={week}>
              <h3>Week: {week}</h3>
              {Object.entries(weekData).map(([category, timeSpent]) => (
                <p key={category}>
                  You have spent {timeSpent} seconds on {category}.
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
