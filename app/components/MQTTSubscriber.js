"use client";

import { useEffect, useState } from "react";
import { connectMQTT } from "../lib/mqttClient";

const MQTTSubscriber = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    const client = connectMQTT();

    client.on("connect", () => {
      setStatus("Connected");
      client.subscribe("#", (err) => {
        if (err) {
          console.error("Subscription error:", err);
        }
      });
    });

    client.on("message", (topic, payload) => {
      setMessage(payload.toString());
      console.log(payload.toString());
    });

    client.on("error", (error) => {
      console.error("Connection error:", error);
      setStatus("Error");
    });

    return () => {
      if (client.connected) {
        client.end();
      }
    };
  }, []);

  return (
    <div>
      <p>Status: {status}</p>
      <p>MQTT Message: {message}</p>
    </div>
  );
};

export default MQTTSubscriber;
