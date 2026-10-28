import { memo } from "react";

const CARD_META = [
  { key: "total", label: "Total Posts", accent: "#4F7CFF" },
  { key: "drafts", label: "Drafts", accent: "#E0A72E" },
  { key: "scheduled", label: "Scheduled", accent: "#7C9CFF" },
  { key: "published", label: "Published", accent: "#3FC97F" },
];

const DashboardCards = memo(function DashboardCards({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARD_META.map((card) => (
        <div key={card.key} className="card p-5">
          <div className="w-8 h-1 rounded-full mb-4" style={{ backgroundColor: card.accent }} />
          <div className="font-display text-3xl font-semibold">{stats[card.key] ?? 0}</div>
          <div className="text-sm text-slate-400 mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  );
});

export default DashboardCards;
