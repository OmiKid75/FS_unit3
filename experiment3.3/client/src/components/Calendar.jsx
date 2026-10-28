import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nextMonth, prevMonth, goToToday } from "../redux/calendarSlice";
import { selectCalendarEvents } from "../redux/selectors";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const STATUS_DOT = { draft: "bg-warn", scheduled: "bg-accent", published: "bg-wa" };

const Calendar = memo(function Calendar() {
  const dispatch = useDispatch();
  const { viewYear, viewMonth } = useSelector((state) => state.calendar);
  const eventsByDay = useSelector(selectCalendarEvents);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const today = new Date();
  const isToday = (day) => day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold">{MONTH_NAMES[viewMonth]} {viewYear}</h2>
        <div className="flex gap-2">
          <button onClick={() => dispatch(prevMonth())} className="btn-ghost px-3 py-1.5 rounded-lg text-sm">←</button>
          <button onClick={() => dispatch(goToToday())} className="btn-ghost px-3 py-1.5 rounded-lg text-sm">Today</button>
          <button onClick={() => dispatch(nextMonth())} className="btn-ghost px-3 py-1.5 rounded-lg text-sm">→</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-slate-500 mb-2 font-mono">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => <div key={d} className="text-center py-1">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => (
          <div
            key={idx}
            className={`aspect-square rounded-lg border p-1.5 flex flex-col ${day ? "border-line" : "border-transparent"} ${isToday(day) ? "border-accent bg-accent/10" : "bg-panel/40"}`}
          >
            {day && (
              <>
                <span className="text-xs text-slate-400 font-mono">{day}</span>
                <div className="flex flex-wrap gap-0.5 mt-auto">
                  {(eventsByDay[day] || []).slice(0, 4).map((post) => (
                    <span key={post._id} title={post.content.slice(0, 40)} className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[post.status] || "bg-slate-500"}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warn" /> Draft</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" /> Scheduled</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-wa" /> Published</span>
      </div>
    </div>
  );
});

export default Calendar;
