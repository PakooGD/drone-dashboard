// src/features/logs/ui/LogWindow/LogWindow.tsx
import React, { useEffect, useRef,useState } from 'react';
import { observer } from 'mobx-react-lite';
import { droneStore } from '../../../shared/stores/droneStore';
import { useLogs } from '../../logs/model/hooks/useLogs';
import styles from './LogWindow.module.scss';

export const LogWindow = observer(() => {

    const logsEndRef = useRef<HTMLDivElement>(null);
    const {
        expandedTopics,
        currentTime,
        timelineRange,
        filteredLogs,
        toggleTopic,
        handleTimelineChange,
    } = useLogs();

    return (
        <div className={styles.logWindow}>
            <div className={styles.logs}>
                {droneStore.selectedDroneId ? (
                    <div>
                        <h3>Logs for {droneStore.selectedDroneId}</h3>
                        {Array.from(droneStore.logs.entries()).map(([topic, logs]) => (
                            <div key={topic} className={styles.topicBlock}>
                                <div
                                    className={styles.topicHeader}
                                    onClick={() => toggleTopic(topic)}
                                >
                                    <span>{topic}</span>
                                </div>
                                {expandedTopics.has(topic) && (
                                    <div className={styles.topicContent}>
                                        {filteredLogs(topic).map((log) => (
                                            <div key={log.id} className={styles.logEntry}>
                                                <span className={styles.timestamp}>{log.timestamp}</span>
                                                <div className={styles.logData}>
                                                    {Object.entries(log.data).map(([key, value]) => (
                                                        <div key={key} className={styles.logField}>
                                                            <span className={styles.fieldName}>{key}:</span>
                                                            <span className={styles.fieldValue}>{JSON.stringify(value)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <h3>Select a drone to view logs</h3>
                )}
                <div ref={logsEndRef} />
            </div>
            <div className={styles.timeline}>
                <input
                    type="range"
                    min={timelineRange.min}
                    max={timelineRange.max}
                    value={currentTime}
                    onChange={handleTimelineChange}
                    className={styles.timelineSlider}
                />
                <div className={styles.timelineLabels}>
                    <span>{new Date(timelineRange.min).toLocaleTimeString()}</span>
                    <span>{new Date(timelineRange.max).toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    );
});