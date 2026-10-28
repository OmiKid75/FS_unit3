import { memo } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4F7CFF", "#E1487C", "#3FC97F", "#E0A72E"];

const chartTooltipStyle = {
  backgroundColor: "#1E242E",
  border: "1px solid #2B3340",
  borderRadius: 8,
  color: "#F1F5F9",
  fontSize: 12,
};

export const PlatformPieChart = memo(function PlatformPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={chartTooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
});

export const StatusBarChart = memo(function StatusBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2B3340" />
        <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
        <YAxis stroke="#64748B" fontSize={12} allowDecimals={false} />
        <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "#2B3340" }} />
        <Bar dataKey="value" fill="#4F7CFF" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
});

export const TrendLineChart = memo(function TrendLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2B3340" />
        <XAxis dataKey="label" stroke="#64748B" fontSize={12} />
        <YAxis stroke="#64748B" fontSize={12} allowDecimals={false} />
        <Tooltip contentStyle={chartTooltipStyle} />
        <Line type="monotone" dataKey="count" stroke="#3FC97F" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
});
