import { useEffect, useMemo, useState } from "react";
import { getContributionGridDates, getPaddedGrid } from "@/lib/grid-utils";
import { GITHUB_GREEN_LEVELS } from "@/lib/colors";

export function CustomPainter({ start, end }: { start: string; end: string }) {
  const [dateLevels, setDateLevels] = useState<Record<string, number>>({});
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isPainting, setIsPainting] = useState(false);

  const allDates = useMemo(
    () => getContributionGridDates(start, end),
    [start, end]
  );

  useEffect(() => {
    // Reset on date change
    const initial: Record<string, number> = {};
    allDates.forEach((d) => (initial[d] = 0));
    setDateLevels(initial);
  }, [allDates]);

  const paddedGrid = useMemo(() => getPaddedGrid(allDates), [allDates]);

  const handlePaint = (date: string) => {
    if (date === "padding") return;
    setDateLevels((prev) => ({ ...prev, [date]: currentLevel }));
  };

  const handleClear = () => {
    const cleared: Record<string, number> = {};
    allDates.forEach((d) => (cleared[d] = 0));
    setDateLevels(cleared);
  };

  const handleCommit = async () => {
    const dates = Object.entries(dateLevels).flatMap(([date, level]) =>
      Array(level).fill(date)
    );

    if (dates.length === 0) {
      alert("Nothing to commit!");
      return;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ dates }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      alert(`✅ ${result.count} commits generated.`);
    } catch (err) {
      console.error(err);
      alert("❌ Error committing to git");
    }
  };

  return (
    <div className="mt-6 pb-[20px]">
      <h2 className="text-xl font-semibold mb-2">🖌️ Custom Painter</h2>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">Paint level:</span>
        {GITHUB_GREEN_LEVELS.map((color, i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded cursor-pointer border-2 ${
              currentLevel === i ? "border-white" : "border-gray-500"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setCurrentLevel(i)}
            title={`Level ${i}`}
          />
        ))}

        <button
          onClick={handleClear}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          🧹 Clear
        </button>

        <button
          onClick={handleCommit}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          ✅ Commit Changes
        </button>
      </div>

      <div
        className="grid grid-cols-[repeat(53,_1fr)] gap-[4px]"
        onMouseDown={() => setIsPainting(true)}
        onMouseUp={() => setIsPainting(false)}
        onMouseLeave={() => setIsPainting(false)}
      >
        {paddedGrid.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-[4px]">
            {week.map((date, dayIdx) => {
              const level = dateLevels[date] ?? -1;
              const color =
                level === -1
                  ? "transparent"
                  : GITHUB_GREEN_LEVELS[level] || "white";

              const isPadding = date === "padding";

              return (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  title={isPadding ? "" : date}
                  onClick={() => handlePaint(date)}
                  onMouseEnter={() => isPainting && handlePaint(date)}
                  className={`w-4 h-4 rounded border border-gray-700 ${
                    isPadding
                      ? "pointer-events-none opacity-20"
                      : "cursor-pointer"
                  }`}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
