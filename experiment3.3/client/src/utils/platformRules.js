export const PLATFORM_LIMITS = {
  facebook: { maxChars: 63206, label: "Facebook", color: "#5B8DEF" },
  instagram: { maxChars: 2200, label: "Instagram", color: "#E1487C" },
  whatsapp: { maxChars: 65536, label: "WhatsApp", color: "#3FC97F" },
};

export const HASHTAG_SUGGESTIONS = [
  "#socialmedia", "#marketing", "#contentcreator", "#digitalmarketing",
  "#branding", "#growth", "#smallbusiness", "#trending",
];

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const statusColor = (status) => {
  switch (status) {
    case "draft":
      return "text-warn border-warn/40 bg-warn/10";
    case "scheduled":
      return "text-accent-soft border-accent/40 bg-accent/10";
    case "published":
      return "text-wa border-wa/40 bg-wa/10";
    default:
      return "text-slate-400 border-line bg-panel";
  }
};
