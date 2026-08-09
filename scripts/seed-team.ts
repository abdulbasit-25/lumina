import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { dbConnect } from "../lib/db";
import { Actor } from "../models/Actor";
import { TeamMember } from "../models/TeamMember";

config({ path: path.join(process.cwd(), ".env.local") });

async function seedTeam() {
  await dbConnect();

  const directors = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "directors_clean.json"), "utf8"));
  const actorsClean = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "actors_clean.json"), "utf8"));
  const crew = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "crew_clean.json"), "utf8"));
  const actorsExtra = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "actors.json"), "utf8"));

  await TeamMember.deleteMany({});
  await TeamMember.insertMany(crew);
  console.log(`✅ Seeded ${crew.length} crew members.`);

  await Actor.deleteMany({});
  const actorMap = new Map<string, string[]>();
  const add = (name: string, genre: string) => {
    if (!name) return;
    if (!actorMap.has(name)) actorMap.set(name, []);
    if (!actorMap.get(name)!.includes(genre)) actorMap.get(name)!.push(genre);
  };

  Object.entries(directors).forEach(([g, names]: [string, string[]]) => names.forEach((n: string) => add(n, g)));
  Object.entries(actorsClean).forEach(([g, names]: [string, string[]]) => names.forEach((n: string) => add(n, g)));
  actorsExtra.forEach((a: {name: string, genres: string[]}) => a.genres.forEach((g: string) => add(a.name, g)));

  const actorDocs = Array.from(actorMap.entries()).map(([name, genres]) => ({
    name,
    genres,
    matchPercent: 90
  }));

  await Actor.insertMany(actorDocs);
  console.log(`✅ Seeded ${actorDocs.length} actors.`);
  process.exit(0);
}

seedTeam().catch(err => {
  console.error(err);
  process.exit(1);
});
