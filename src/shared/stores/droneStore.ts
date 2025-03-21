// src/shared/stores/droneStore.ts
import { makeAutoObservable } from 'mobx';
import { fetchDrones, updateTopics, redirectLogs } from '../api/api';
import { Drone,Log,TopicStatus } from '../types/ITypes';


class DroneStore {
    drones: Drone[] = [];
    selectedDroneId: string | null = null;
    logs: Map<string, Log[]> = new Map();
    socket: WebSocket | null = null

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
}

export const droneStore = new DroneStore();
