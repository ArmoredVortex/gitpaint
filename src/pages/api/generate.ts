import { commitOnDates } from "../../lib/git";

export default async function handler(req, res) {
  const { dates } = req.body;

  try {
    await commitOnDates(dates);
    res.status(200).json({ success: true, count: dates.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
