import simpleGit from "simple-git";
import fs from "fs";

const git = simpleGit();
const FILE = "paint.txt";

export async function commitOnDates(dates: string[], file = FILE) {
  for (const date of dates) {
    fs.writeFileSync(file, `Commit on ${date}\n`, { flag: "a" });
    await git.add(file);
    await git.commit(`Commit on ${date}`, file, {
      "--date": date,
    });
  }

  console.log(`Committed ${dates.length} dates`);
}
