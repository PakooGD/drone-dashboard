// src/shared/api/api.ts
import axios from 'axios';
import { Drone,TopicStatus } from '../types/ITypes';


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