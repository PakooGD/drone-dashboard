export interface TopicData {
    name: string;
    topic: string;
    timestamp: bigint;
    data: Record<string, any>;
}

export interface LogMessage {
    droneId: string;
    content: TopicData;
}

export interface Log {
    id: string;
    timestamp: string;
    data: TopicData;
}
