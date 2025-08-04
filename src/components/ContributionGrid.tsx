// src/components/ContributionGrid.tsx
import React from "react";
import { eachDayOfInterval, parseISO, format } from "date-fns";

const LEVELS = [
  "transparent", // -1 → padding
  "#ebedf0", // 0 commits
  "#9be9a8", // 1+
  "#40c463", // 3+
  "#30a14e", // 5+
  "#216e39", // 7+
];

function getColor(level: number) {
  return LEVELS[level + 1] || LEVELS[1]; // shift index by +1 to support -1
}

function getGrid(startDate: string, endDate: string, dates: string[]) {
  const dayCount: Record<string, number> = {};
  for (const date of dates) {
    const key = format(new Date(date), "yyyy-MM-dd");
    dayCount[key] = (dayCount[key] || 0) + 1;
  }

  const originalStart = parseISO(startDate);
  const originalEnd = parseISO(endDate);

  // Head padding if startDate isn't Sunday (0)
  const paddingStart = originalStart.getDay(); // 0 (Sun) to 6 (Sat)
  const paddedStart = new Date(originalStart);
  paddedStart.setDate(originalStart.getDate() - paddingStart);

  const allDays = eachDayOfInterval({ start: paddedStart, end: originalEnd });

  const columns: string[][] = [];

  for (let i = 0; i < allDays.length; i += 7) {
    const week = allDays.slice(i, i + 7).map((day) => {
      const key = format(day, "yyyy-MM-dd");

      // If before originalStart or after originalEnd, treat as padding
      if (day < originalStart || day > originalEnd) return getColor(-1);

      const commits = dayCount[key] || 0;

      let level = 0;
      if (commits === 0) level = 0;
      else if (commits >= 7) level = 4;
      else if (commits >= 5) level = 3;
      else if (commits >= 3) level = 2;
      else level = 1;

      return getColor(level);
    });

    // Pad final week if incomplete (usually not needed due to date-fns interval logic)
    while (week.length < 7) {
      week.push(getColor(-1));
    }

    columns.push(week);
  }

  return columns;
}

export function ContributionGrid({
  start,
  end,
  dates,
}: {
  start: string;
  end: string;
  dates: string[];
}) {
  if (!start || !end || dates.length === 0) return null;

  const columns = getGrid(start, end, dates);

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-2">Contribution Preview</h2>
      <div className="flex gap-1 overflow-x-auto">
        {columns.map((week, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-1">
            {week.map((color, rowIdx) => (
              <div
                key={rowIdx}
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: color,
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
