import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const src = path.join(__dirname, "frontend", "dist");
const dest = __dirname;

console.log(`Copying built files from ${src} to ${dest}...`);
try {
  fs.cpSync(src, dest, { recursive: true });
  console.log("Build files successfully copied to workspace root!");
} catch (err) {
  console.error("Error copying build files:", err);
}
