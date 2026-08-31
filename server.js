const { spawn } = require("child_process");
const path = require("path");

console.log("Starting unified Node/Express server on Hostinger's assigned port...");
const backend = spawn("node", [path.join(__dirname, "backend", "server.js")], {
  stdio: "inherit",
  env: process.env, // This inherits Hostinger's assigned PORT
});

backend.on("exit", (code) => {
  console.log(`Backend process exited with code ${code}`);
});
