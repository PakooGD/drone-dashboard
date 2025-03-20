// src/features/logs/model/hooks/useLogs.ts
import { useState, useEffect } from 'react';
import { droneStore } from '../../../../shared/stores/droneStore';
import { TimelineRange } from '../types';
import { Log } from '../types';

export const useLogs = () => {
    const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [timelineRange, setTimelineRange] = useState<TimelineRange>({ min: 0, max: 100 });

    // Обновляем диапазон таймлайна на основе данных
    useEffect(() => {
        const allLogs = Array.from(droneStore.logs.values()).flat();
        if (allLogs.length > 0) {
            const timestamps = allLogs.map((log: Log) => new Date((log.timestamp).toString()).getTime());
            const minTime = Math.min(...timestamps);
            const maxTime = Math.max(...timestamps);
            setTimelineRange({ min: minTime, max: maxTime });
            setCurrentTime(minTime);
        }
    }, [droneStore.logs]);

    // Функция для фильтрации данных по текущему времени
    const filteredLogs = (topic: string) => {
        const logs = droneStore.logs.get(topic) || [];
        return logs.filter((log:any) => new Date((log.timestamp).toString()).getTime() <= currentTime);
    };

    // Функция для раскрытия/сворачивания блока топика
    const toggleTopic = (topic: string) => {
        setExpandedTopics((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(topic)) {
                newSet.delete(topic);
            } else {
                newSet.add(topic);
            }
            return newSet;
        });
    };

    // Функция для обработки изменения положения ползунка
    const handleTimelineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTime(Number(event.target.value));
    };

    return {
        expandedTopics,
        currentTime,
        timelineRange,
        filteredLogs,
        toggleTopic,
        handleTimelineChange,
    };
};