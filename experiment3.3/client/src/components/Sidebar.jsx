import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const creatorLinks = [
  { to: "/", label: "Dashboard", icon: "◧" },
  { to: "/create", label: "Create Post", icon: "✎" },
  { to: "/drafts", label: "Drafts", icon: "▢" },
  { to: "/scheduled", label: "Scheduled", icon: "◷" },
  { to: "/calendar", label: "Calendar", icon: "▦" },
  { to: "/analytics", label: "Analytics", icon: "▲" },
  { to: "/settings", label: "Settings", icon: "⚙" },
];

const adminOnlyLinks = [{ to: "/admin", label: "Admin Dashboard", icon: "🛡" }];

const viewerLinks = [{ to: "/browse", label: "Browse Posts", icon: "👁" }];

const Sidebar = () => {
  const { isAdmin, isViewer } = useAuth();

  let links = creatorLinks;
  if (isAdmin) links = [...adminOnlyLinks, ...creatorLinks];
  else if (isViewer) links = viewerLinks;

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-line bg-surface/60 px-4 py-6">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-soft flex items-center justify-center font-display font-bold text-sm">S</div>
          <span className="font-display font-semibold text-lg tracking-tight">SocialSync</span>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-accent/15 text-accent-soft border border-accent/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-panel border border-transparent"
              }`
            }
          >
            <span className="w-5 text-center">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-2 pt-6 text-xs text-slate-500 font-mono">v1.0 · MERN</div>
    </aside>
  );
};

export default Sidebar;