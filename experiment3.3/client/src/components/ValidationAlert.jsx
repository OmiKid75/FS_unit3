const ValidationAlert = ({ errors = [], warnings = [] }) => {
  if (!errors.length && !warnings.length) return null;

  return (
    <div className="flex flex-col gap-2">
      {errors.map((err, i) => (
        <div key={`err-${i}`} className="text-sm px-3 py-2 rounded-lg border border-danger/40 bg-danger/10 text-danger">
          {err}
        </div>
      ))}
      {warnings.map((warn, i) => (
        <div key={`warn-${i}`} className="text-sm px-3 py-2 rounded-lg border border-warn/40 bg-warn/10 text-warn">
          {warn}
        </div>
      ))}
    </div>
  );
};

export default ValidationAlert;
