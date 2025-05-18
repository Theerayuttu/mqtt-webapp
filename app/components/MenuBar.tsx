// components/MenuBar.tsx
import React from "react";

export default function MenuBar({ onMenuClick }: { onMenuClick: (menu: string) => void }) {
  return (
    <aside className="w-64 bg-[#0B1120] text-white flex flex-col justify-between py-6 px-4">
      <div>
        <div className="text-center mb-10">
          <img src="/logo.png" alt="COMPRESSOR" className="h-10 mx-auto mb-2" />
          <p className="text-xs uppercase tracking-widest">ALPHA DEVELOPMENT</p>
        </div>

        <nav className="space-y-4">
          <MenuItem icon="🏠" label="Dashboard" onClick={() => onMenuClick("dashboard")} />
          <MenuItem icon="📂" label="Monitoring" onClick={() => onMenuClick("monitor")} />
          <MenuItem icon="🚨" label="Alarm" onClick={() => onMenuClick("alarm")} />
        </nav>
      </div>

      <div className="space-y-4">
        <MenuItem icon="🔔" label="Notification" onClick={() => onMenuClick("notification")} />
        <MenuItem icon="↩️" label="Logout" onClick={() => onMenuClick("logout")} />
        <div className="bg-blue-700 p-3 rounded-lg text-center">
          <p className="font-semibold">AlphaSystem</p>
          <p className="text-xs">Engineering</p>
        </div>
      </div>
    </aside>
  );
}

function MenuItem({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <div
      className="flex items-center justify-between hover:text-blue-400 cursor-pointer text-gray-400 py-2"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
    </div>
  );
}
