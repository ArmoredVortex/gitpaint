export function generateRandomDates(
  start: Date,
  end: Date,
  intensity = 0.5
): string[] {
  const result: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    if (Math.random() < intensity) {
      const iso = new Date(current).toISOString();
      result.push(iso);
    }
    current.setDate(current.getDate() + 1);
  }

  return result;
}
