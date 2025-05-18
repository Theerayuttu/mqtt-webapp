import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import dayjs from "dayjs";

interface ChartData {
  time: number;
  value: number;
}

const attributeOptions = ["position.attributes.power", "position.attributes.engineLoad", "position.attributes.coolantTemp", 
                          "position.attributes.rpm", "position.attributes.airPressure", "position.attributes.airTemp", 
                          "position.attributes.distance", "position.attributes.battery", 
                          "position.attributes.batteryLevel"];

const apiHost = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [attribute, setAttribute] = useState(attributeOptions[0]);

  useEffect(() => {
    const fetchData = async () => {
      const startDate = dayjs().startOf("day").toISOString();
      const endDate = dayjs().endOf("day").toISOString();

      try {
        const res = await fetch(
          `${apiHost}/api/mqtt-data?deviceId=4&startDate=${startDate}&endDate=${endDate}`
        );
        const json = await res.json();

        const transformed = json
          .map((item: any) => {
            const rawValue = getValueByPath(item.message, attribute);
            return {
              time: new Date(item.receivedtime).getTime(),
              value: parseFloat(rawValue ?? "0") || 0,
            };
          })
          .filter((item: ChartData) => item.value !== 0);

        setData(transformed);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchData();
  }, [attribute]);

  const getValueByPath = (data: any, path: string): string | undefined => {
    try {
      return path.split(".").reduce((o: any, k) => (o || {})[k], data);
    } catch (e) {
      console.error("Error accessing path:", path, e);
      return undefined;
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Graph 1</h2>
        <select
          className="border px-2 py-1 rounded"
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
        >
          {attributeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt.split(".").pop()}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            type="number"
            scale="time"
            domain={['auto', 'auto']}
            tickFormatter={(time) => dayjs(time).format("HH:mm")}
          />
          <YAxis domain={['auto', 'auto']} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip 
            labelFormatter={(value) => dayjs(value).format('HH:mm')}
            formatter={(value: number) => [`${value.toFixed(2)}`, 'Value']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorValue)"
            dot={{ r: 1 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
