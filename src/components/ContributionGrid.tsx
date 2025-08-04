// src/components/ContributionGrid.tsx
import React from "react";
import { eachDayOfInterval, parseISO, format, startOfWeek } from "date-fns";

const LEVELS = [
  "#ebedf0", // 0 commits - light gray
  "#9be9a8", // 1+
  "#40c463", // 3+
  "#30a14e", // 5+
  "#216e39", // 7+
];

function getColor(level: number) {
  return LEVELS[Math.min(level, 4)];
}

function getGrid(startDate: string, endDate: string, dates: string[]) {
  const dayCount = {};
  for (const date of dates) {
    const key = format(new Date(date), "yyyy-MM-dd");
    dayCount[key] = (dayCount[key] || 0) + 1;
  }
  // console.log(dayCount);

  const start = startOfWeek(parseISO(startDate), { weekStartsOn: 0 });
  const allDays = eachDayOfInterval({ start, end: parseISO(endDate) });

  const columns: string[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    const week = allDays.slice(i, i + 7).map((d) => {
      const key = format(d, "yyyy-MM-dd");
      // console.log(key);
      // console.log(dayCount[key]);
      const commits = dayCount[key] || 0;
      console.log(commits);
      // const level = Math.min(commits, 4); // Cap intensity
      const level = commits === 0 ? 0 : Math.min(commits, LEVELS.length - 1);
      return getColor(level);
    });
    columns.push(week);
  }

  return columns;
}

export function ContributionGrid({ start, end, dates }) {
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
