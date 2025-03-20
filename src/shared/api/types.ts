// src/shared/api/types.ts
export interface Drone {
    id: string;
    topics: Topic[];
}
  
export interface Topic {
    name: string;
    isSubscribed: boolean;
}
  
export interface Log {
    id: string;
    timestamp: bigint;
    data: Record<string, any>;
}