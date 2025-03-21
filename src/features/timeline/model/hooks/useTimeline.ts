// src/features/logs/model/hooks/useLogs.ts
import { useState, useEffect } from 'react';
import { droneStore } from '../../../../shared/stores/droneStore';
import { Log } from '../../../../shared/types/ITypes';
import { TimelineRange } from '../types';

export const useTimeline = () => {
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

    // Функция для обработки изменения положения ползунка
    const handleTimelineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTime(Number(event.target.value));
    };

    return {
        currentTime,
        timelineRange,
        handleTimelineChange,
    };
};