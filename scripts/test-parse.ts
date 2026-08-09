import fs from "fs";
import path from "path";

const teamPath = path.join(process.cwd(), "src", "Team.json");
if (!fs.existsSync(teamPath)) {
    console.error("File not found:", teamPath);
    process.exit(1);
}
const content = fs.readFileSync(teamPath, "utf-8");

console.log("Content length:", content.length);

const directorsMatch = content.match(/Directors\s*(\{[\s\S]*?\})\s*Actors/);
const actorsMatch = content.match(/Actors\s*(\{[\s\S]*?\})\s*crew memebers/);
const crewMatch = content.match(/crew memebers\s*(\[[\s\S]*?\])/);

console.log("Directors match found:", !!directorsMatch);
console.log("Actors match found:", !!actorsMatch);
console.log("Crew match found:", !!crewMatch);

if (directorsMatch) {
    try {
        const d = JSON.parse(directorsMatch[1]);
        console.log("Directors parsed, count:", Object.keys(d).length);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        console.error("Directors parse error:", message);
        console.log("Problematic text:", directorsMatch[1].slice(0, 100));
    }
}

if (actorsMatch) {
    try {
        const a = JSON.parse(actorsMatch[1]);
        console.log("Actors parsed, count:", Object.keys(a).length);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        console.error("Actors parse error:", message);
    }
}

if (crewMatch) {
    try {
        const c = JSON.parse(crewMatch[1]);
        console.log("Crew parsed, count:", c.length);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        console.error("Crew parse error:", message);
    }
}
