#!/usr/bin/env node
const {loadConfig,fileMaker} = require("../src/index.js");
const fs = require("fs");

if(process.argv[2]?.toLowerCase?.() === "init"){
    fs.writeFileSync("./mc-encryption.config.json",JSON.stringify({
        "key":"encryption_key",
        "include":"./src",
        "out":"./dist/index.js",
        "entry":"index.js",
        "key_lock":false,
        "name_lock":true,
        "external_modules":[
            "@minecraft/server",
            "@minecraft/server-ui"
        ],
    },null,"   "));
    process.exit(0);
}
const config = process.argv[2]??"./mc-encryption.config.json";
if(!fs.existsSync(config)) {
    console.error("Config file not found: " + config);
    process.exit(1);
}
const stats = fs.statSync(config);
let file = config;
if(stats.isDirectory()) {
    if(fs.existsSync(file + "/mc-encryption.config.json")) file += "/mc-encryption.config.json"
    else {console.error("Config path is not a file: " + config);
    process.exit(1);}
}else if(!stats.isFile()){
    console.error("Config path is not a file: " + config);
    process.exit(1);
}
try {
    JSON.parse(fs.readFileSync(config,"utf-8"))
} catch (error) {
    console.error("Invalid Json schema: " + fs.readFileSync(config,"utf-8"));
    process.exit(1);
}
try {
    fileMaker(loadConfig(config));
} catch (error) {
    console.error(error.constructor.name + ":" + error.message);
    process.exit(1);
}