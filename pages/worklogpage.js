import Link from 'next/link';
import useLocalStorageState from 'use-local-storage-state';

export default function WorkLogPage() {
  const [workLog, setWorkLog] = useLocalStorageState('workLog', {});

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
      {workLog && Object.entries(workLog).map(([year, data]) => (
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
