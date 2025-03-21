export interface AuthResponse {
    accessToken:string;
    refreshToken:string;
    drone: Drone;
}

export interface Drone{
    id:string;
    schemas:TopicSchema[];
}
  
export interface Topic {
    name: string;
    isSubscribed: boolean;
}

export interface TopicSchema {
    topic: string,
    encoding: string,
    schemaName: string,
    schema: any,
}
  
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

export interface TopicStatus {
    schemaName: string;
    status: boolean;
}