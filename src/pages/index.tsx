import { useState } from "react";
import { DateRangePicker } from "../components/DateRangePicker";
import { IntensitySlider } from "../components/IntensitySlider";
import { GenerateButton } from "../components/GenerateButton";
import { ContributionGrid } from "@/components/ContributionGrid";

export default function Home() {
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
      <h1 className="text-3xl font-bold mb-6">🎨 GitPaint - Random Mode</h1>

      <DateRangePicker
        start={start}
        end={end}
        onStartChange={setStart}
        onEndChange={setEnd}
      />
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
    </main>
  );
}
