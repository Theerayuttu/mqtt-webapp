"use client";

import { useEffect, useState } from "react";
import { connectMQTT } from "../lib/mqttClient";
import ReactSpeedometer from "react-d3-speedometer";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

const MQTTMonitor = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Connecting...");

  const [data, setData] = useState<any[]>([]);
  const [latest, setLatest] = useState<any>({});

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
      const msg = JSON.parse(payload.toString());
      const attr = msg?.position?.attributes;
      const receivedTime = msg?.position?.deviceTime;

      setMessage(payload.toString());

      if (attr) {
        const entry = {
          time: dayjs(receivedTime).add(7, 'hour').format("HH:mm"), // UTC+7
          temp: msg?.position?.altitude,
          humidity: msg?.position?.speed,
          batteryLevel: attr.batteryLevel,
          battery: attr.battery,
        };

        setLatest(entry);
        setData(prev => [...prev.slice(-20), entry]); // Keep last 20 points
      }
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
    <div className="grid grid-cols-3 gap-6 p-6 bg-white">
      

      {/* Temperature */}
      <div>
        <h2 className="text-sky-500 font-bold mb-2">Temperature</h2>
        <ReactSpeedometer
          maxValue={120}
          minValue={-30}
          value={latest.temp || 0}
          needleColor="black"
          startColor="orange"
          segments={10}
          endColor="gray"
          textColor="black"
          height={200}
        />
        <h3 className="mt-2 font-semibold text-left">Temp gauge</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis domain={[-30, 120]} />
            <CartesianGrid stroke="#eee" />
            <Tooltip />
            <Line type="monotone" dataKey="temp" stroke="#007acc" name="Temp °C" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Humidity */}
      <div>
        <h2 className="text-sky-500 font-bold mb-2">Humidity</h2>
        <ReactSpeedometer
          maxValue={100}
          minValue={-10}
          value={latest.humidity || 0}
          needleColor="black"
          startColor="green"
          endColor="gray"
          segments={10}
          textColor="black"
          height={200}
        />
        <h3 className="mt-2 font-semibold text-left">Humidity gauge</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis domain={[-10, 100]} />
            <CartesianGrid stroke="#eee" />
            <Tooltip />
            <Line type="monotone" dataKey="humidity" stroke="#00c49f" name="Humidity %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-sky-500 font-bold mb-2">Power</h2>
        <ReactSpeedometer
          maxValue={100}
          value={latest.batteryLevel || 0}
          startColor="green"
          endColor="gray"
          needleColor="black"
          textColor="black"
          height={200}
        />
        <h3 className="mt-2 font-semibold text-left">Battery level</h3>

        <ReactSpeedometer
          maxValue={6}
          value={latest.battery || 0}
          startColor="lime"
          endColor="gray"
          needleColor="black"
          textColor="black"
          height={200}
        />
        <h3 className="mt-2 font-semibold text-left">Voltage</h3>
      </div>
      <div>{message}</div>
    </div>
  );
};

export default MQTTMonitor;