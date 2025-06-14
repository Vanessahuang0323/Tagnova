import { JobApplication } from '../types/job';
import { useEffect, useState } from 'react';

type ApplicationUpdateCallback = (application: JobApplication) => void;

class ApplicationWebSocketService {
  private ws: WebSocket | null = null;
  private callbacks: ApplicationUpdateCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000; // 初始重连延迟（毫秒）

  constructor() {
    this.connect();
  }

  private connect() {
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8080'}/applications`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.reconnectTimeout = 1000;
    };

    this.ws.onmessage = (event) => {
      try {
        const application = JSON.parse(event.data) as JobApplication;
        this.notifyCallbacks(application);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectTimeout *= 2; // 指数退避
      setTimeout(() => this.connect(), this.reconnectTimeout);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private notifyCallbacks(application: JobApplication) {
    this.callbacks.forEach(callback => callback(application));
  }

  public subscribe(callback: ApplicationUpdateCallback) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  public unsubscribe(callback: ApplicationUpdateCallback) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  public close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// 创建单例实例
export const applicationWebSocket = new ApplicationWebSocketService();

// WebSocket Hook
export const useWebSocket = () => {
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

  useEffect(() => {
    const handleMessage = (application: JobApplication) => {
      setLastMessage(new MessageEvent('message', { data: JSON.stringify(application) }));
    };

    const unsubscribe = applicationWebSocket.subscribe(handleMessage);

    return () => {
      unsubscribe();
    };
  }, []);

  return { lastMessage };
};