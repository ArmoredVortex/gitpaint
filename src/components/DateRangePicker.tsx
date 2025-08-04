import React from "react";

export function DateRangePicker({ start, end, onStartChange, onEndChange }) {
  return (
    <div className="flex gap-4 items-center">
      <label className="flex flex-col">
        Start Date
        <input
          type="date"
          value={start}
          onChange={(e) => onStartChange(e.target.value)}
          className="p-2 border rounded"
        />
      </label>
      <label className="flex flex-col">
        End Date
        <input
          type="date"
          value={end}
          onChange={(e) => onEndChange(e.target.value)}
          className="p-2 border rounded"
        />
      </label>
    </div>
  );
}
