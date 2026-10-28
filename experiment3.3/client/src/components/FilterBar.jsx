const FilterBar = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <input
        type="text"
        placeholder="Search by keyword…"
        className="input-field px-3 py-2 text-sm flex-1 min-w-[200px]"
        value={filters.keyword || ""}
        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
      />
      <select
        className="input-field px-3 py-2 text-sm"
        value={filters.platform || ""}
        onChange={(e) => setFilters({ ...filters, platform: e.target.value || undefined })}
      >
        <option value="">All platforms</option>
        <option value="facebook">Facebook</option>
        <option value="instagram">Instagram</option>
        <option value="whatsapp">WhatsApp</option>
      </select>
      <input
        type="date"
        className="input-field px-3 py-2 text-sm"
        value={filters.dateFrom || ""}
        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value || undefined })}
      />
      <input
        type="date"
        className="input-field px-3 py-2 text-sm"
        value={filters.dateTo || ""}
        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value || undefined })}
      />
    </div>
  );
};

export default FilterBar;
