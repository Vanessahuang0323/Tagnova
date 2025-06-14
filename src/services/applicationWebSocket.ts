import { JobApplication } from '../types/job';
import { useEffect, useState } from 'react';

type ApplicationUpdateCallback = (application: JobApplication) => void;

class ApplicationWebSocketService {
  private ws: WebSocket | null = null;
  private callbacks: ApplicationUpdateCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000; // 初始重连延迟（毫秒）
  private isConnecting = false;
  private connectionFailed = false;

  constructor() {
    this.connect();
  }

  private connect() {
    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      return;
    }

    // If connection has failed too many times, don't keep trying
    if (this.connectionFailed) {
      console.warn('WebSocket connection permanently failed. Not attempting to reconnect.');
      return;
    }

    this.isConnecting = true;
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8080'}/applications`;
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.reconnectTimeout = 1000;
        this.isConnecting = false;
        this.connectionFailed = false;
      };

      this.ws.onmessage = (event) => {
        try {
          const application = JSON.parse(event.data) as JobApplication;
          this.notifyCallbacks(application);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        this.isConnecting = false;
        
        // Only attempt reconnect if it wasn't a deliberate close
        if (event.code !== 1000) {
          this.attemptReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.warn('WebSocket connection failed. This is expected if no WebSocket server is running.');
        this.isConnecting = false;
        
        // Don't log as error since this is expected in development without a WebSocket server
        if (this.reconnectAttempts === 0) {
          console.info('WebSocket server not available. Real-time updates will be disabled.');
        }
      };

      // Set a timeout to detect connection failures
      setTimeout(() => {
        if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
          console.warn('WebSocket connection timeout');
          this.ws.close();
        }
      }, 5000);

    } catch (error) {
      console.warn('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectTimeout = Math.min(this.reconnectTimeout * 2, 30000); // Cap at 30 seconds
      
      console.log(`Attempting WebSocket reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${this.reconnectTimeout}ms`);
      
      setTimeout(() => this.connect(), this.reconnectTimeout);
    } else {
      console.info('WebSocket connection attempts exhausted. Real-time updates disabled.');
      this.connectionFailed = true;
    }
  }

  private notifyCallbacks(application: JobApplication) {
    this.callbacks.forEach(callback => {
      try {
        callback(application);
      } catch (error) {
        console.error('Error in WebSocket callback:', error);
      }
    });
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
      this.ws.close(1000, 'Client closing connection');
      this.ws = null;
    }
    this.connectionFailed = true;
  }

  public getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'failed' {
    if (this.connectionFailed) return 'failed';
    if (this.isConnecting) return 'connecting';
    if (this.ws?.readyState === WebSocket.OPEN) return 'connected';
    return 'disconnected';
  }
}

// 创建单例实例
export const applicationWebSocket = new ApplicationWebSocketService();

// WebSocket Hook
export const useWebSocket = () => {
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'failed'>('connecting');

  useEffect(() => {
    const handleMessage = (application: JobApplication) => {
      setLastMessage(new MessageEvent('message', { data: JSON.stringify(application) }));
    };

    const unsubscribe = applicationWebSocket.subscribe(handleMessage);

    // Check connection status periodically
    const statusInterval = setInterval(() => {
      setConnectionStatus(applicationWebSocket.getConnectionStatus());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
    };
  }, []);

  return { lastMessage, connectionStatus };
};