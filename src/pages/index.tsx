import { useState } from "react";
import { DateRangePicker } from "../components/DateRangePicker";
import { IntensitySlider } from "../components/IntensitySlider";
import { GenerateButton } from "../components/GenerateButton";

export default function Home() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [intensity, setIntensity] = useState(0.5);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!start || !end) return alert("Please select both dates");
    setLoading(true);
    try {
      const res1 = await fetch("/api/random", {
        method: "POST",
        body: JSON.stringify({ start, end, intensity }),
        headers: { "Content-Type": "application/json" },
      });
      const { dates } = await res1.json();

      const res2 = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ dates }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res2.json();
      alert(`✅ ${result.count} commits generated.`);
    } catch (err) {
      console.error(err);
      alert("❌ Error generating commits");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🎨 GitPaint - Random Mode</h1>

      <DateRangePicker
        start={start}
        end={end}
        onStartChange={setStart}
        onEndChange={setEnd}
      />
      <IntensitySlider intensity={intensity} setIntensity={setIntensity} />
      <GenerateButton onClick={handleGenerate} loading={loading} />
    </main>
  );
}
