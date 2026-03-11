import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.connecting = false;
        this.subscriptions = {};
        this.pendingSubs = [];
        this.pendingSends = [];
    }

    connect(onConnected, onError) {
        if (this.connected) {
            if (onConnected) onConnected();
            return;
        }

        if (this.connecting) {
            const start = Date.now();
            const t = setInterval(() => {
                if (this.connected) {
                    clearInterval(t);
                    if (onConnected) onConnected();
                    return;
                }
                if (Date.now() - start > 10000) {
                    clearInterval(t);
                    if (onError) onError(new Error('WebSocket connect timeout'));
                }
            }, 250);
            return;
        }

        this.connecting = true;
        // Resolve WS base: prefer env; fallback to same-origin '/ws'
        const envBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_WS_BASE_URL) ? import.meta.env.VITE_WS_BASE_URL : null;
        const sockUrl = envBase ? (envBase.endsWith('/ws') ? envBase : `${envBase}/ws`) : '/ws';
        // Use factory to enable auto-reconnect per stompjs recommendation
        this.stompClient = Stomp.over(() => new SockJS(sockUrl));
        // Optional: tune reconnect delay
        this.stompClient.reconnectDelay = 5000;

        this.stompClient.connect(
            {},
            (frame) => {
                console.log('WebSocket Connected:', frame);
                this.connected = true;
                this.connecting = false;
                // flush any pending subscriptions
                try {
                    this.pendingSubs.forEach(({ dest, cb, key }) => {
                        const sub = this.stompClient.subscribe(dest, (message) => {
                            const data = JSON.parse(message.body);
                            cb(data);
                        });
                        if (key) this.subscriptions[key] = sub;
                    });
                } finally {
                    this.pendingSubs = [];
                }

                // flush any pending sends
                try {
                    (this.pendingSends || []).forEach((fn) => {
                        try { fn(); } catch {}
                    });
                } finally {
                    this.pendingSends = [];
                }
                if (onConnected) onConnected();
            },
            (error) => {
                console.error('WebSocket Error:', error);
                this.connected = false;
                this.connecting = false;
                if (onError) onError(error);
            }
        );
    }

    disconnect() {
        if (this.stompClient && this.connected) {
            try { this.unsubscribeAll(); } catch {}
            this.stompClient.disconnect();
            this.connected = false;
            this.connecting = false;
            this.pendingSubs = [];
            this.pendingSends = [];
            console.log('WebSocket Disconnected');
        }
    }

    _queueSub(dest, cb, key) {
        // prevent duplicates when connect() is called multiple times
        this.pendingSubs = (this.pendingSubs || []).filter(p => p.key !== key);
        this.pendingSubs.push({ dest, cb, key });
    }

    _replaceSub(key, dest, callback) {
        if (this.subscriptions[key]) {
            try { this.subscriptions[key].unsubscribe(); } catch {}
            delete this.subscriptions[key];
        }

        if (!this.connected) {
            console.warn('WebSocket not connected yet, queuing subscription', dest);
            this._queueSub(dest, callback, key);
            return null;
        }

        const subscription = this.stompClient.subscribe(dest, (message) => {
            const data = JSON.parse(message.body);
            callback(data);
        });
        this.subscriptions[key] = subscription;
        return subscription;
    }

    // Subscribe to ride updates for a specific user
    subscribeToRideUpdates(userId, callback) {
        const dest = `/topic/ride-updates/${userId}`;
        const key = `ride-${userId}`;
        return this._replaceSub(key, dest, callback);
    }

    // Subscribe to driver location updates
    subscribeToDriverLocation(driverId, callback) {
        const dest = `/topic/driver-location/${driverId}`;
        const key = `driver-${driverId}`;
        return this._replaceSub(key, dest, callback);
    }

    // Some backends publish driver location per ride/booking instead of per driver
    subscribeToDriverLocationByRide(bookingId, callback) {
        const dest = `/topic/driver-location/${bookingId}`;
        const key = `driver-ride-${bookingId}`;
        return this._replaceSub(key, dest, callback);
    }

    // Subscribe to new ride requests (for drivers)
    subscribeToRideRequests(driverId, callback) {
        const dest = `/queue/ride-requests/${driverId}`;
        const key = `requests-${driverId}`;
        return this._replaceSub(key, dest, callback);
    }

    // Subscribe to chat messages for a specific ride
    subscribeToChat(rideId, callback) {
        const dest = `/topic/chat/${rideId}`;
        const key = `chat-${rideId}`;
        if (this.subscriptions[key]) {
            try { this.subscriptions[key].unsubscribe(); } catch {}
            delete this.subscriptions[key];
        }

        if (!this.connected) {
            console.warn('WebSocket not connected yet, queuing subscription', dest);
            this._queueSub(dest, callback, key);
            return null;
        }

        const subscription = this.stompClient.subscribe(dest, (message) => {
            try {
                const data = JSON.parse(message.body);
                callback(data);
            } catch (e) {
                console.warn('Failed to parse chat message', e);
            }
        });

        this.subscriptions[key] = subscription;
        return subscription;
    }

    // Send driver location update
    sendLocationUpdate(driverId, location, _retry = false) {
        const payload = {
            driverId,
            latitude: location.lat,
            longitude: location.lng,
            heading: location.heading,
            speed: location.speed
        };

        const sendNow = () => {
            try {
                this.stompClient.send('/app/driver-location', {}, JSON.stringify(payload));
            } catch (e) {
                console.warn('sendLocationUpdate failed', e);
            }
        };

        if (this.connected) {
            sendNow();
            return;
        }

        // If not connected, queue the send and attempt to connect once.
        this.pendingSends = this.pendingSends || [];
        this.pendingSends.push(sendNow);

        if (_retry) return;
        this.connect(() => {
            // queued sends will be flushed in connect()
        }, () => {
            // keep queued sends; next connect() attempt will flush
        });
    }

    // Send chat message
    sendChatMessage(rideId, senderId, message, meta = {}) {
        if (!this.connected) {
            console.error('WebSocket not connected');
            return;
        }

        this.stompClient.send(
            '/app/chat',
            {},
            JSON.stringify({
                rideId,
                senderId,
                senderName: meta.senderName,
                senderType: meta.senderType,
                clientMessageId: meta.clientMessageId,
                message,
                timestamp: meta.timestamp || new Date().toISOString()
            })
        );
    }

    // Unsubscribe from a specific topic
    unsubscribe(subscriptionKey) {
        if (this.subscriptions[subscriptionKey]) {
            this.subscriptions[subscriptionKey].unsubscribe();
            delete this.subscriptions[subscriptionKey];
        }
    }

    // Unsubscribe from all topics
    unsubscribeAll() {
        Object.keys(this.subscriptions).forEach(key => {
            this.subscriptions[key].unsubscribe();
        });
        this.subscriptions = {};
    }

    isConnected() {
        return this.connected;
    }
}

// Export singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
