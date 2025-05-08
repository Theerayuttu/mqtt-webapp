// Connect MQTT Server by webSocket

import mqtt from 'mqtt';

export function connectMQTT() {
  const options = {
    clientId: 'mqtt_' + Math.random().toString(16).substr(2, 8),
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
    // If authentication, add
    // username: 'your_username',
    // password: 'your_password',
  };

  const client = mqtt.connect('ws://localhost:9001', options);
  return client;
}