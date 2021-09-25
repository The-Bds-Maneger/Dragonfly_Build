async function render(){
    const fetch = (await import('node-fetch')).default;
    const go_mod = (await (await fetch("https://raw.githubusercontent.com/df-mc/dragonfly/master/go.mod")).text()).split(/\n/gi);
    const GetTunnelInfo = go_mod.filter(lines => lines.includes("sandertv/gophertunnel"))[0].trim().split(/\s+/gi);
    const DragonflyProtocollVersion = (await (await fetch(`https://raw.githubusercontent.com/Sandertv/gophertunnel/${GetTunnelInfo[GetTunnelInfo.length - 1]}/minecraft/protocol/info.go`)).text()).split(/\n/gi).filter(lines => lines.includes("CurrentVersion")).filter(comment => !comment.includes("//"))[0].trim().replace(/CurrentVersion\s+=\s+"(.*)"/gi, (match, p1) => p1);
    console.log(DragonflyProtocollVersion);
    
    // Load release
    const release =[...(await (await fetch("https://api.github.com/repos/The-Bds-Maneger/Dragonfly_Build/releases")).json())].find(release => release.tag_name === DragonflyProtocollVersion);
    // Write env
    const fs = require("fs");
    fs.writeFileSync("env.json", JSON.stringify({
        dragonfly_version: DragonflyProtocollVersion,
        allow_upload: `${release === undefined}`,
    }));
}
render();