// src/shared/stores/droneStore.ts
import { makeAutoObservable } from 'mobx';
import { fetchDrones, subscribeToTopic, unsubscribeFromTopic, fetchLogs } from '../api/api';
import { Drone, Topic, Log } from '../api/types';

class DroneStore {
  drones: Drone[] = [];
  selectedDroneId: string | null = null;
  logs: Log[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadDrones();
  }

  async loadDrones() {
    try {
      this.drones = await fetchDrones();
    } catch (error) {
      console.error('Failed to load drones:', error);
    }
  }

  async toggleTopicSubscription(droneId: string, topicName: string) {
    const drone = this.drones.find((d) => d.id === droneId);
    if (drone) {
      const topic = drone.topics.find((t) => t.name === topicName);
      if (topic) {
        if (topic.isSubscribed) {
          await unsubscribeFromTopic(droneId, topicName);
        } else {
          await subscribeToTopic(droneId, topicName);
        }
        topic.isSubscribed = !topic.isSubscribed;
      }
    }
  }

  async selectDrone(id: string) {
    this.selectedDroneId = id;
    this.loadLogs(id);
  }

  async loadLogs(droneId: string) {
    try {
      this.logs = await fetchLogs(droneId);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  }
}

export const droneStore = new DroneStore();