import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useSSE(endpoint, onMessage, enabled = true) {
    const [connectionState, setConnectionState] = useState('connecting'); // 'connecting', 'connected', 'error', 'disconnected'
    const [lastError, setLastError] = useState(null);
    const eventSourceRef = useRef(null);
    const { getAccessToken } = useAuth();
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const baseReconnectDelay = 1000; // 1 segundo

    const connect = () => {
        if (!enabled) return;

        try {
            // Cerrar conexión existente si la hay
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            setConnectionState('connecting');
            setLastError(null);

            const token = getAccessToken();
            if (!token) {
                throw new Error('No authentication token available');
            }

            // Construir URL con token como query parameter para SSE
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
            const url = new URL(`${baseUrl}${endpoint}`);
            url.searchParams.append('token', token);

            // Para SSE, necesitamos incluir el token en la URL ya que no podemos usar headers personalizados
            const eventSource = new EventSource(url.toString(), {
                withCredentials: true
            });

            eventSourceRef.current = eventSource;

            eventSource.onopen = () => {
                setConnectionState('connected');
                reconnectAttempts.current = 0;
            };

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (onMessage) {
                        onMessage(data);
                    }
                } catch (error) {
                    // console.error('Error parsing SSE message:', error);
                }
            };

            eventSource.onerror = (error) => {
                // console.error('SSE connection error:', error);
                setConnectionState('error');
                setLastError('Connection error occurred');

                // Intentar reconectar con backoff exponencial
                if (reconnectAttempts.current < maxReconnectAttempts) {
                    const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts.current);
                    reconnectAttempts.current++;

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, delay);
                } else {
                    setConnectionState('disconnected');
                    setLastError('Max reconnection attempts reached');
                }
            };

        } catch (error) {
            // console.error('Error creating SSE connection:', error);
            setConnectionState('error');
            setLastError(error.message);
        }
    };

    const disconnect = () => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        setConnectionState('disconnected');
        reconnectAttempts.current = 0;
    };

    const reconnect = () => {
        disconnect();
        connect();
    };

    useEffect(() => {
        if (enabled) {
            connect();
        } else {
            disconnect();
        }

        return () => {
            disconnect();
        };
    }, [endpoint, enabled]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    return {
        connectionState,
        lastError,
        reconnect,
        disconnect,
        isConnected: connectionState === 'connected'
    };
}