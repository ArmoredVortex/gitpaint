import React from "react";

export function IntensitySlider({ intensity, setIntensity }) {
  return (
    <div className="mt-4">
      <label>
        Intensity: {Math.round(intensity * 100)}%
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
          className="w-full"
        />
      </label>
    </div>
  );
}
