import Link from 'next/link';
import useLocalStorageState from 'use-local-storage-state';

const secondsToHoursMinutes = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return { hours, minutes };
};

export default function WorkLogPage() {
  const [workLog, setWorkLog] = useLocalStorageState('workLog', {});

  const showInitialWorkLogs = () => (
    <div>
      <h2>Year: 2023</h2>
      <div>
        <h3>Week 1:</h3>
        <p>This is where your work time will appear.</p>
      </div>
    </div>
  );

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
      {(!workLog || Object.keys(workLog).length === 0) ? (
        showInitialWorkLogs()
      ) : (
        Object.entries(workLog).map(([year, data]) => (
          <div key={year}>
            <h2>Year: {year}</h2>
            {Object.entries(data).map(([week, weekData]) => (
              <div key={week}>
                <h3>Week: {week}</h3>
                {Object.entries(weekData).map(([category, timeSpent]) => {
                  const { hours, minutes } = secondsToHoursMinutes(timeSpent);
                  return (
                    <p key={category}>
                      You have spent {hours} hours and {minutes} minutes on {category}.
                    </p>
                  );
                })}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}