// src/shared/stores/droneStore.ts
import { makeAutoObservable, observable } from 'mobx';
import { fetchDrones, updateTopics, redirectLogs } from '../api/api';
import { Drone,Log,TopicStatus, LogMessage } from '../types/ITypes';
import { v4 as uuidv4 } from 'uuid';


class DroneStore {
    drones: Drone[] = [];
    selectedDroneId: string | null = null;
    socket: WebSocket | null = null
    logs = observable.map<string, Map<string, Log[]>>(); // droneId -> topic -> logs

    constructor() {
        makeAutoObservable(this);
        this.loadDrones();
    }

    async loadDrones() {
        try {
            this.drones = await fetchDrones();
            console.log(this.drones);
        } catch (error) {
            console.error('Failed to load drones:', error);
        }
    }

    async updateSubscriptions(droneId: string, topics: TopicStatus[]) {
        try {
            await updateTopics({ drone_id: droneId, topics: topics });
            console.log('Subscriptions updated successfully for drone:', droneId);
        } catch (error) {
            console.error('Failed to update subscriptions:', error);
            throw error;
        }
    }

    async redirectLogs(droneId: string, selectedPath: string) {
        try {
            await redirectLogs({ droneId: droneId, selectedPath: selectedPath });
            this.selectedDroneId = droneId
            console.log('LogDirection updated successfully for drone:', droneId);
        } catch (error) {
            console.error('LogDirection to update subscriptions:', error);
            throw error;
        }
    }

    addLog(data: LogMessage) {
        const log: Log = {
            id: uuidv4(),
            timestamp: new Date(Number(data.content.timestamp)).toISOString(),
            data: data.content,
        };

        if (!this.logs.has(data.droneId)) {
            this.logs.set(data.droneId, observable.map<string, Log[]>());
        }
        const droneLogs = this.logs.get(data.droneId)!;

        if (!droneLogs.has(data.content.topic)) {
            droneLogs.set(data.content.topic, observable.array<Log>());
        }
        const topicLogs = droneLogs.get(data.content.topic)!;

        topicLogs.push(log);
    }

    getLogAtTime(droneId: string, topic: string, timestamp: string): Log | undefined {
        const topicLogs = this.logs.get(droneId)?.get(topic);
        if (!topicLogs) return undefined;

        return topicLogs.find((log) => log.timestamp <= timestamp);
    }
}

export const droneStore = new DroneStore();
