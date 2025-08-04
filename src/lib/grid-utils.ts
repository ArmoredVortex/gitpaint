// lib/grid-utils.ts
export function getContributionGridDates(start: string, end: string): string[] {
  const s = new Date(start);
  const e = new Date(end);
  const dates: string[] = [];

  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }

  return dates;
}

export function getPaddedGrid(dates: string[]): string[][] {
  if (dates.length === 0) return [];

  const firstDate = new Date(dates[0]);
  const lastDate = new Date(dates[dates.length - 1]);

  const paddingStart = firstDate.getDay(); // Sunday = 0
  const paddingEnd = 6 - lastDate.getDay(); // Saturday = 6

  const padded = [
    ...Array(Math.max(0, paddingStart)).fill("padding-start"),
    ...dates,
    ...Array(Math.max(0, paddingEnd)).fill("padding-end"),
  ];

  const grid: string[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    grid.push(padded.slice(i, i + 7));
  }

  return grid;
}
