import { generateRandomDates } from "../../lib/random";

export default function handler(req, res) {
  const { start, end, intensity } = req.body;
  const dates = generateRandomDates(
    new Date(start),
    new Date(end),
    intensity ?? 0.5
  );
  res.status(200).json({ dates });
}
