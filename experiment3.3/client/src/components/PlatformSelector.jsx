import { useDispatch, useSelector } from "react-redux";
import { selectPlatform, deselectPlatform } from "../redux/platformsSlice";
import { selectSelectedPlatforms } from "../redux/selectors";

const PLATFORMS = [
  { id: "facebook", label: "Facebook", color: "#5B8DEF" },
  { id: "instagram", label: "Instagram", color: "#E1487C" },
  { id: "whatsapp", label: "WhatsApp", color: "#3FC97F" },
];

const PlatformSelector = () => {
  const dispatch = useDispatch();
  const selected = useSelector(selectSelectedPlatforms);

  const toggle = (id) => {
    if (selected.includes(id)) dispatch(deselectPlatform(id));
    else dispatch(selectPlatform(id));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORMS.map((p) => {
        const active = selected.includes(p.id);
        return (
          <button
            type="button"
            key={p.id}
            onClick={() => toggle(p.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 ${
              active ? "text-white border-transparent" : "border-line text-slate-400 hover:text-slate-200"
            }`}
            style={active ? { backgroundColor: p.color } : {}}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: active ? "white" : p.color }} />
            {p.label}
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;