// src/shared/api/api.ts
import axios from 'axios';
import { Drone, Log } from './types';

const API_URL = 'http://localhost:3000'; // Замените на ваш URL сервера

// Получить список дронов
export const fetchDrones = async (): Promise<Drone[]> => {
  const response = await axios.get(`${API_URL}/drones`);
  return response.data;
};

// Подписаться на топик
export const subscribeToTopic = async (droneId: string, topicName: string): Promise<void> => {
  await axios.post(`${API_URL}/subscribe`, { droneId, topicName });
};

// Отписаться от топика
export const unsubscribeFromTopic = async (droneId: string, topicName: string): Promise<void> => {
  await axios.post(`${API_URL}/unsubscribe`, { droneId, topicName });
};

// Получить логи для дрона
export const fetchLogs = async (droneId: string): Promise<Log[]> => {
  const response = await axios.get(`${API_URL}/logs`, { params: { droneId } });
  return response.data;
};