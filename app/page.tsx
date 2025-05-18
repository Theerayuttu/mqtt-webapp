"use client";
import React, { useState } from "react";
import Head from "next/head";
import MQTTMonitor from "./components/MQTTMonitor";
import MenuBar from "./components/MenuBar";
import Dashboard from "./components/Dashboard";

export default function Home() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "monitor":
        return <MQTTMonitor />;
      case "alarm":
        return <div className="p-6">Alarm Page</div>;
      case "notification":
        return <div className="p-6">Notifications</div>;
      default:
        return <div className="p-6">Welcome</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <MenuBar onMenuClick={setActivePage} />
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}
