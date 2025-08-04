import { useState } from "react";
import { DateRangePicker } from "../components/DateRangePicker";
import { IntensitySlider } from "../components/IntensitySlider";
import { ContributionGrid } from "@/components/ContributionGrid";
import { CustomPainter } from "@/components/CustomPainter";

export default function Home() {
  const [mode, setMode] = useState<"random" | "custom">("random");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [intensity, setIntensity] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [previewDates, setPreviewDates] = useState<string[]>([]);
  const [generated, setGenerated] = useState(false);

  async function handleGenerate() {
    if (!start || !end) return alert("Please select both dates");
    setLoading(true);
    try {
      const res = await fetch("/api/random", {
        method: "POST",
        body: JSON.stringify({ start, end, intensity }),
        headers: { "Content-Type": "application/json" },
      });
      const { dates } = await res.json();
      setPreviewDates(dates);
      setGenerated(true);
    } catch (err) {
      console.error(err);
      alert("❌ Error generating preview");
    } finally {
      setLoading(false);
    }
  }

  async function handleCommit() {
    if (!generated || previewDates.length === 0) {
      alert("Generate a preview first!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ dates: previewDates }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      alert(`✅ ${result.count} commits generated.`);
    } catch (err) {
      console.error(err);
      alert("❌ Error committing to git");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          🎨 GitPaint - {mode === "random" ? "Random Mode" : "Custom Mode"}
        </h1>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "random" | "custom")}
          className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="random">Random</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <DateRangePicker
        start={start}
        end={end}
        onStartChange={setStart}
        onEndChange={setEnd}
      />

      {mode === "random" && (
        <>
          <IntensitySlider intensity={intensity} setIntensity={setIntensity} />

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleGenerate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              🎨 Generate Preview
            </button>
            <button
              onClick={handleCommit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-40"
              disabled={!generated}
            >
              ✅ Commit to GitHub
            </button>
          </div>

          <ContributionGrid start={start} end={end} dates={previewDates} />
        </>
      )}

      {mode === "custom" && (
        <CustomPainter
          start={start}
          end={end}
          onChange={(dates) => {
            setPreviewDates(dates);
            setGenerated(true);
          }}
          onCommit={handleCommit}
        />
      )}
    </main>
  );
}
