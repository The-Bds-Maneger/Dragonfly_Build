const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const os = require("os");
const action_core = require("@actions/core");

if (fs.existsSync("./env.json")) {
  const env = require("./env.json");
  Object.getOwnPropertyNames(env).forEach(key => {
    process.env[key] = env[key];
    action_core.exportVariable(key, env[key]);
  });
}

// Clone repo Function
async function CloneDragonfly(){
  const TmpDir = path.join(os.tmpdir(), Math.random() + Math.random().toString());
  child_process.execFileSync("git", ["clone", "https://github.com/df-mc/dragonfly", "--depth", 1, TmpDir]);
  return TmpDir;
}

// Build
function BuildGo(arch = "", RepoPath = "", Out = ""){
  return new Promise((resolve, reject) => {
    const Ll = child_process.execFile("go", ["build", "-o", Out], {
      cwd: RepoPath,
      env: {
        ...process.env,
        GOARCH: arch,
      }
    });
    Ll.stdout.on("data", data => process.stdout.write(data));
    Ll.stderr.on("data", data => process.stdout.write(data));
    Ll.on("exit", code => {
      if (code === 0) resolve(); else reject(code);
    });
  });
}

// Build Bin File
async function Build(){
  const RepoPath = await CloneDragonfly();
  const arch = [];
  if (process.platform === "linux") arch.push("amd64", "arm64", "386");
  else if (process.platform === "win32") arch.push("amd64", "386");
  else if (process.platform === "darwin") arch.push("amd64", "arm64");
  else if (process.platform === "android") arch.push("arm64");
  else throw new Error("Not valid platform");
  for (let Arch of arch) {
    let OutPutFile = path.join(__dirname, "BuildOut", `Dragonfly_${process.env.dragonfly_version}_${process.platform}_${Arch}`);
    if (process.platform === "win32") OutPutFile += ".exe";
    await BuildGo(Arch, RepoPath, OutPutFile);
  }
}

Build()
