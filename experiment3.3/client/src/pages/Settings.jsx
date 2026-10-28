import { useState } from "react";
import Navbar from "../components/Navbar";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true);

  const ToggleRow = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-line last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative ${checked ? "bg-accent" : "bg-line"}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );

  return (
    <>
      <Navbar title="Settings" />
      <main className="flex-1 px-6 py-6 max-w-lg">
        <div className="card p-6">
          <h3 className="font-display text-base font-semibold mb-2">Preferences</h3>
          <ToggleRow label="Notifications" description="Get notified when scheduled posts publish" checked={notifications} onChange={setNotifications} />
          <ToggleRow label="Auto-save drafts" description="Automatically save posts as drafts while editing" checked={autoSaveDrafts} onChange={setAutoSaveDrafts} />
        </div>
      </main>
    </>
  );
};

export default Settings;
