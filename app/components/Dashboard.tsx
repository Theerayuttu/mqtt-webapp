"use client";

import { useEffect, useState } from "react";
import DashboardChart from "./DashboardChart";

type MqttData = {
  devices: number;
  messages: number;
  topics: number;
  protocals: number;
  totalhours: number;
  totalDistance: number;
  odometer: number;
  maxspeed: number;
  rpm: number;
  engineLoad: number;
  airPressure: number;
  airTemp: number;
  airFlow: number;
  Consumption: number;
  throttle: number;
  power: number;
};

export default function Dashboard() {

  const [data, setData] = useState<MqttData>({
    devices: 0,
    messages: 0,
    topics: 0,
    protocals: 0,
    totalhours: 0,
    totalDistance: 0,
    odometer: 0,
    maxspeed: 0,
    rpm: 0,
    engineLoad: 0,
    airPressure: 0,
    airTemp: 0,
    airFlow: 0,
    Consumption: 0,
    throttle: 0,
    power: 0,
  });

  const apiHost = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(`${apiHost}/api/summary`);
        const json = await res.json();
        setData({
          devices: json[0].no_devices ?? 0,
          messages: json[0].no_messages ?? 0,
          topics: json[0].no_topic ?? 0,
          protocals: json[0].no_protocol ?? 0,
          totalhours: json[0].totalhours ?? 0,
          totalDistance: json[0].totalDistance ?? 0,
          odometer: json[0].odometer ?? 0,
          maxspeed: json[0].maxspeed ?? 0,
          rpm: json[0].rpm ?? 0,
          engineLoad: json[0].engineLoad ?? 0,
          airPressure: json[0].airPressure ?? 0,
          airTemp: json[0].airTemp ?? 0,
          airFlow: json[0].airFlow ?? 0,
          Consumption: json[0].Consumption ?? 0,
          throttle: json[0].throttle ?? 0,
          power: json[0].power ?? 0,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    getData();
  }, []);

  return (
    <div className="p-1 grid grid-cols-1 gap-3">
      <h1 className="text-2xl font-semibold mb-4">Motor/Compressor Dashboard</h1>
      
      {/* Section 1: Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Devices" value={`${data.devices}`} unit='unit' />
        <Card title="Messages" value={`${data.messages.toLocaleString()}`} unit='unit' />
        <Card title="Topics" value={`${data.topics}`} unit='unit' />
        <Card title="Hours" value={`${data.totalhours.toLocaleString()}`} unit='hours' />
        <Card title="Protocols" value={`${data.protocals}`} unit='unit' />
        <Card title="RPM" value={`${data.rpm.toLocaleString()}`} unit='rpm/min' />
        <Card title="Load" value={`${data.engineLoad.toLocaleString()}`} unit='%' />
        <Card title="Temp" value={`${data.airTemp.toLocaleString()}`} unit='°C' />
      </div>
  
      {/* Section 2: Machine Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4 flex">
          <img src="/compressor1.png" alt="compressor" className="rounded-xl w-32 h-32 object-cover mr-4" />
          <div className="text-sm text-gray-700">
            <p><strong>Brand:</strong> Mitsubishi</p>
            <p><strong>Type:</strong> Q9</p>
            <p><strong>Serial Number:</strong> SN14310709432</p>
            <p><strong>Location:</strong> TEST</p>
            <p><strong>Protocol:</strong> Huabao</p>
            <p><strong>Last Update:</strong> 1 min</p>
          </div>
        </div>
  
        <div className="bg-white rounded-xl shadow p-4 flex">
          <img src="/compressor2.png" alt="compressor" className="rounded-xl w-32 h-32 object-cover mr-4" />
          <div className="text-sm text-gray-700">
            <p><strong>Brand:</strong> Siemens</p>
            <p><strong>Type:</strong> A80</p>
            <p><strong>Serial Number:</strong> AL868934987</p>
            <p><strong>Location:</strong> TEST</p>
            <p><strong>Protocol:</strong> Siemens</p>
            <p><strong>Last Update:</strong> 1 min</p>
          </div>
        </div>
      </div>
  
      {/* Section 3: Graph */}
      <div className="bg-white rounded-xl shadow">
        <DashboardChart />
      </div>
  
    </div>
  );  
}

function Card({ title, value, unit, highlight = false }: { title: string; value: string; unit?: string; highlight?: boolean }) {
  return (
    <div className={`p-2 grid grid-cols-2 gap-5 rounded-xl shadow bg-white ${highlight ? "bg-green-100" : ""}`}>
      <div className={`p-2 grid grid-cols-1 gap-4`}>
        <p className="text-sm">{title}</p>
        <h2 className="text-xl font-bold">{value}</h2>
        <h3 className="text-sm text-gray-500">{unit}</h3>
      </div>
      <div className={`pl-15`}><img src="/valueicon.png" alt={value} className="h-10 mx-auto mb-2" /></div>
    </div>
  );
}


