import { useSelector } from "react-redux";
import { PLATFORM_LIMITS } from "../utils/platformRules";
import { selectSelectedPlatforms } from "../redux/selectors";

// Reads selected platforms straight from Redux instead of via a prop.
const CharacterCounter = ({ content }) => {
  const platforms = useSelector(selectSelectedPlatforms);

  if (!platforms.length) {
    return <p className="text-xs text-slate-500">Select a platform to see character limits.</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {platforms.map((platform) => {
        const rule = PLATFORM_LIMITS[platform];
        if (!rule) return null;
        const used = content.length;
        const remaining = rule.maxChars - used;
        const overLimit = remaining < 0;
        const nearLimit = !overLimit && remaining < rule.maxChars * 0.1;

        return (
          <div
            key={platform}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
              overLimit ? "border-danger/50 text-danger bg-danger/10" :
              nearLimit ? "border-warn/50 text-warn bg-warn/10" :
              "border-line text-slate-400 bg-panel"
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rule.color }} />
            {rule.label}: {used}/{rule.maxChars} {overLimit ? `(${Math.abs(remaining)} over)` : `(${remaining} left)`}
          </div>
        );
      })}
    </div>
  );
};

export default CharacterCounter;
