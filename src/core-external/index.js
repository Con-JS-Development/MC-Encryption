import fs from "fs";
import { Coder, EncryptionKey } from "../core-internal/Coder.js";
import path from "path";

const EncriptedModuleClass = "EncriptedModule";
const PathClassName = "Path";
const module_require = "module_require";
const default_config = {
    "regex_filter":"/[^]+\.js$/",
    "entry":"index",
    "external_modules":[],
    "key_lock":false,
    "name_lock":true
};
const baseCode = fs.readFileSync(__dirname + "/internal.js");
function generateRandomString(length=10) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function *getFiles(from, base = undefined){
    for(const a of fs.readdirSync([...arguments].join("/"),{withFileTypes:true})){
        if(a.isFile() && a.name.endsWith(".js")) yield base?base + "/" + a.name:a.name;
        if(a.isDirectory()) yield * getFiles(from, base?base + "/" + a.name:a.name);
    }
}
function ensureDirSync(dirPath) {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}
function fileMaker(key, config){
    if(!fs.existsSync(path.dirname(path.relative(".",config.output)))) ensureDirSync(path.dirname(path.relative(".",config.output)));
    if(!fs.statSync(config.include).isDirectory()){
        let encrypted_modules = [];
        for(const file of getFiles(config.include)){
            encrypted_modules.push({name:file,code:Coder.Code(fs.readFileSync(config.include + "/" + file,"utf-8"),key)});
        }
    }else{

    }
    codeMaker()
}
function codeMaker(encrypted_modules,external_modules,entry,key_lock,name_lock){
    console.log("Generating Code");
    let external_module_names = [];
    let code = "";
    for(const external_module of external_modules){
        let newName = "ex_" + generateRandomString();
        while(external_module_names.includes(newName)) newName = "ex_" + generateRandomString();
        external_module_names.push(newName);
        code += `import * as ${newName} from "${external_module.path}";\n`;
        external_module.path = newName;
    }
    code += baseCode + ";\n";
    code += `const entry = "${entry??encrypted_modules[0]?.path}";`
    code += `const key_lock = ${key_lock??false};`;
    code += `const name_lock = ${name_lock??true};\n`;
    code += `const external_modules = {`
    for (const external_module of external_modules) code+=`"${external_module.name}":${external_module.path}`;
    code += "};\n"
    code  += `const encrypted_modules = {`
    for (const encrypt_module of encrypted_modules) {
        code += `"${encrypt_module.name}":new ${EncriptedModuleClass}(\`${encrypt_module.code.replace("\\","\\\\").replace("`","\\`")}\`,new ${PathClassName}(${encrypt_module.name}),${module_require})`
    }
    code += "};\n"
}
function loadConfig(path){
    if(!fs.existsSync(path)) throw new ReferenceError("File doesn't not exist: " + path);
    const config = Object.setPrototypeOf(JSON.parse(fs.readFileSync(path)),default_config);
    try {config.regex_filter = new RegExp(config.regex_filter);} catch (error) {throw new SyntaxError("Invalid Regex filter: " + error.message)}
    if(!fs.existsSync(config.include)) throw new ReferenceError("Included file or directory doesn't exist");
    if(!config.output || config.output === "") throw new TypeError("Output property not specified");
    if((config.key??"").length < 1) throw new SyntaxError("key is not defined in config");
    config.relative = path;
    return config;
}
codeMaker(new EncryptionKey("bob"), loadConfig(".\\src\\encryption.config.json"));