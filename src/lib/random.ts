export function generateRandomDates(
  start: Date,
  end: Date,
  intensity = 0.5 // 0 to 1, both frequency and density
): string[] {
  const result: string[] = [];
  const current = new Date(start);

  const maxCommitsPerDay = Math.round(intensity * 10); // up to 4 commits/day for high intensity

  while (current <= end) {
    if (Math.random() < intensity) {
      const commitCount = Math.floor(Math.random() * (maxCommitsPerDay + 1)); // 0 to maxCommitsPerDay

      for (let i = 0; i < commitCount; i++) {
        const iso = new Date(current).toISOString();
        result.push(iso);
      }
    }
    current.setDate(current.getDate() + 1);
  }

  return result;
}
