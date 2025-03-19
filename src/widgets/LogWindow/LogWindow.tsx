// src/widgets/LogWindow/LogWindow.tsx
import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { droneStore } from '../../shared/stores/droneStore';
import styles from './LogWindow.module.scss';

export const LogWindow = observer(() => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [droneStore.logs]);

  return (
    <div className={styles.logWindow}>
      <div className={styles.logs}>
        {droneStore.selectedDroneId ? (
          <div>
            <h3>Logs for {droneStore.selectedDroneId}</h3>
            {droneStore.logs.map((log) => (
              <div key={log.id} className={styles.logEntry}>
                <span>{log.timestamp}</span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        ) : (
          <h3>Select a drone to view logs</h3>
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
});