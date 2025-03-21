import { makeAutoObservable, observable } from 'mobx';
import { Log, LogMessage } from './types';
import { v4 as uuidv4 } from 'uuid';

class LogStore {
    logs = observable.map<string, Map<string, Log[]>>(); // droneId -> topic -> logs
    socket: WebSocket | null = null;
    reconnectAttempts = 0;
    maxReconnectAttempts = 5;

    constructor() {
        makeAutoObservable(this);
    }

    createConnection() {
        this.socket = new WebSocket('ws://localhost:8083');

        this.socket.onopen = () => {
            console.log('WebSocket connection opened');
            this.reconnectAttempts = 0;
        };

        this.socket.onmessage = (event) => {
            const { source, content } = JSON.parse(event.data);
            const result: LogMessage = {
                droneId: source,
                content: JSON.parse(content),
            };
            this.addLog(result);
        };

        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
            this.handleReconnect();
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.handleReconnect();
        };
    }

    addLog(data: LogMessage) {
        const log: Log = {
            id: uuidv4(),
            timestamp: new Date(Number(data.content.timestamp)).toISOString(),
            data: data.content,
        };

        // Группируем логи по droneId и topic
        if (!this.logs.has(data.droneId)) {
            this.logs.set(data.droneId, observable.map<string, Log[]>());
        }
        const droneLogs = this.logs.get(data.droneId)!;

        if (!droneLogs.has(data.content.topic)) {
            droneLogs.set(data.content.topic, observable.array<Log>());
        }
        const topicLogs = droneLogs.get(data.content.topic)!;

        // Добавляем новый лог
        topicLogs.push(log);
    }

    // Получить данные для конкретного топика на определенный момент времени
    getLogAtTime(droneId: string, topic: string, timestamp: string): Log | undefined {
        const topicLogs = this.logs.get(droneId)?.get(topic);
        if (!topicLogs) return undefined;

        // Находим лог, который был актуален на момент timestamp
        return topicLogs.find((log) => log.timestamp <= timestamp);
    }

    closeConnection() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
            setTimeout(() => this.createConnection(), 3000);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }
}

export const logStore = new LogStore();