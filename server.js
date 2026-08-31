const { spawn } = require("child_process");
const path = require("path");

console.log("Starting backend Express server on port 5000...");
const backend = spawn("node", [path.join(__dirname, "backend", "server.js")], {
  stdio: "inherit",
  env: Object.assign({}, process.env, { PORT: "5000" }),
});

console.log("Starting frontend TanStack Start server on Hostinger's assigned port...");
const frontend = spawn("node", [path.join(__dirname, "frontend", "dist", "server", "server.js")], {
  stdio: "inherit",
  env: process.env, // This inherits Hostinger's assigned PORT
});

backend.on("exit", (code) => {
  console.log(`Backend process exited with code ${code}`);
});

frontend.on("exit", (code) => {
  console.log(`Frontend process exited with code ${code}`);
});
