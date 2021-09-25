const fs = require("fs");
const action_core = require("@actions/core");

if (fs.existsSync("./env.json")) {
  const env = JSON.parse(fs.readFileSync("./env.json"));
  Object.getOwnPropertyNames(env).forEach(key => {
    process.env[key] = env[key];
    action_core.exportVariable(key, env[key]);
  });
} else {
  console.error("env.json not found");
}
