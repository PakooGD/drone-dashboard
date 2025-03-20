// src/shared/api/api.ts
import axios from 'axios';
import { Drone } from './models/IDrone';
import { TopicStatus } from './models/ITopicStatus';
import { Log } from '../../features/logs/model/types';
import { droneStore } from '../stores/droneStore';

const API_URL = 'http://localhost:5000/api'; 

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
})
$api.interceptors.request.use((config)=>{
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
})
export default $api;

const socket = new WebSocket('ws://localhost:8083');

socket.onopen = () => {
    console.log('open connection')
}

socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const topicLogs = droneStore.logs.get(data.topic) || [];
    const log: Log = {
        id: Date.now().toString(),
        timestamp: new Date(Number(data.timestamp)).toISOString(),
        data: data.data,
    };
    topicLogs.push(log);
    droneStore.logs.set(data.topic,topicLogs)
};


// Получить список дронов
export const fetchDrones = async (): Promise<Drone[]> => {
  const response = await $api.get(`${API_URL}/drones`, {withCredentials: true});
  console.log(response)
  return response.data;
};

// Обновить подписки
export const updateTopics = async (data: { drone_id: string; topics: TopicStatus[] }): Promise<void> => {
  await $api.post(`${API_URL}/topics/update`, data);
};

// Обновить подписки
export const redirectLogs = async (data: { droneId: string, selectedPath: string }): Promise<void> => {
  await $api.post(`${API_URL}/log/redirect`, data);
};