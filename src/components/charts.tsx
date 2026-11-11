import { useEffect, useState, type ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SERIES } from "@/lib/metrics";

export function WhenMounted({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="h-64 rounded-xl bg-paper" />;
  return <>{children}</>;
}

const tooltipStyle = {
  background: "#fffcf9",
  border: "1px solid #e3ddd4",
  borderRadius: 12,
  fontSize: 12,
  color: "#1a2422",
};

export function TrendChart({ data, keys }: { data: Record<string, string | number>[]; keys: string[] }) {
  return (
    <WhenMounted>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#e3ddd4" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: "#5e6d6a", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "#5e6d6a", fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {keys.map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={SERIES[index % SERIES.length]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </WhenMounted>
  );
}

export function CoverageChart({ data }: { data: { district: string; voices: number }[] }) {
  return (
    <WhenMounted>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#e3ddd4" vertical={false} />
            <XAxis dataKey="district" tick={{ fill: "#5e6d6a", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "#5e6d6a", fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="voices" fill="#0e5c56" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </WhenMounted>
  );
}

export function SplitBar({
  data,
  xKey,
  keys,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  keys: string[];
}) {
  return (
    <WhenMounted>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#e3ddd4" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fill: "#5e6d6a", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "#5e6d6a", fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {keys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={SERIES[index % SERIES.length]} radius={[6, 6, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </WhenMounted>
  );
}
