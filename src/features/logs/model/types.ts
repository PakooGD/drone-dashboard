// src/features/logs/model/types.ts
export interface Log {
    id: string;
    timestamp: bigint | string;
    data: Record<string, any>;
}

export interface TopicData {
    name: string;
    topic: string;
    timestamp: bigint;
    data: Record<string, any>;
}

export interface TimelineRange {
    min: number;
    max: number;
}