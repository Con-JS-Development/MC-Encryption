const fs = require("fs");
const path = require("path");

const EncriptedModuleClass = "EM";
const PathClassName = "Path";
const module_require = "module_require";
const baseCode = fs.readFileSync(__dirname + "/internal.js");
function loadScriptFile(file){
    const a = fs.readFileSync(file,"utf-8");
    try {
        Function(a);
    } catch (error) {
        error.message = " in script: " + file + " -> " + error.message;
        throw error;
    }
    return a;
}
function ensureDirSync(dirPath) {
  try {
    console.log("[Encryptor] Creating dir:", dirPath);
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}
function fileMaker(config){
    console.log("[Encryptor]", "Building Encryption Key");
    let key = new EncryptionKey(config.key);
    if(!fs.existsSync(path.dirname(config.relative(config.out)))) ensureDirSync(path.dirname(config.relative(config.out)));
    let encrypted_modules = [];
    const include = config.relative(config.include);
    let stat = fs.statSync(include);
    if(stat.isDirectory()){
        for(const file of getFiles(include)) {
            console.log("[Encryptor]", "Encrypting " + file);
            encrypted_modules.push({name:file,code:Coder.Code(loadScriptFile(include + "/" + file),key)});
        }
    }else{
        let a = include.split(/\\|\//g).pop();
        console.log("[Encryptor]", "Encrypting " + a);
        encrypted_modules.push({name:a,code:Coder.Code(loadScriptFile(include),key)});
    }
    const external_modules = config.external_modules.map(e=>{
        console.log("[Encryptor]", "Defining external modules  " + JSON.stringify(e));
        if(typeof e === "string") return {name:e,path:e};
        if(typeof e === "object" && e.name && e.path) return e;
        return undefined;
    }).filter(e=>e!==undefined);
    console.log(config.entry);
    if(!config.entry) {
        console.log("[Encryptor]","Assigned first module as entry: " + encrypted_modules[0].name);
        config.entry = encrypted_modules[0].name;
    }
    let entry = encrypted_modules.find((e)=>e.name === config.entry);
    if(!entry) throw new ReferenceError("No entry point found: " + entry);
    fs.writeFileSync(config.relative(config.out),codeMaker(encrypted_modules,external_modules,entry.name,config.key_lock, config.name_lock));
    console.log("[Encryptor]", "Done, output file:", config.relative(config.out));
}
function codeMaker(encrypted_modules,external_modules,entry,key_lock,name_lock){
    console.log("[Encryptor]-[Coder]","Generating Code...");
    let external_module_names = [];
    let code = "";
    for(const external_module of external_modules){
        let newName = "ex_" + generateRandomString();
        while(external_module_names.includes(newName)) newName = "ex_" + generateRandomString();
        external_module_names.push(newName);
        console.log("[Encryptor]-[Coder]","Importing module " + external_module.path +" as "+ newName);
        code += `import * as ${newName} from "${external_module.path}";\n`;
        external_module.path = newName;
    }
    code += baseCode + ";\n";
    code += `const entry = "${entry??encrypted_modules[0]?.path}";`
    code += `const key_lock = ${key_lock??false};`;
    code += `const name_lock = ${name_lock??true};\n`;
    code += `const external_modules = {`
    for (const external_module of external_modules) code+=`"${external_module.name}":${external_module.path},`;
    code += "};\n"
    code  += `const encrypted_modules = {\n`
    for (const encrypt_module of encrypted_modules) {
        console.log("[Encryptor]-[Coder]","Defining encrypted module " + encrypt_module.name);
        code += `   "${encrypt_module.name}":new ${EncriptedModuleClass}(\`${encrypt_module.code.replace("\\","\\\\").replace("`","\\`")}\`,new ${PathClassName}("${encrypt_module.name}"),${module_require}),\n`
    }
    code += "};\n";
    console.log("[Encryptor]-[Coder]","Code generated");
    return code;
}
function loadConfig(con){
    if(!fs.existsSync(con)) throw new ReferenceError("File doesn't not exist: " + paconth);
    const config = Object.setPrototypeOf(JSON.parse(fs.readFileSync(con)),default_config);
    try {config.regex_filter = new RegExp(config.regex_filter);} catch (error) {throw new SyntaxError("Invalid Regex filter: " + error.message)}
    if(!fs.existsSync(path.resolve(path.dirname(con),config.include))) throw new ReferenceError("Included file or directory doesn't exist: " + path.resolve(path.dirname(con),config.include));
    if(!config.out || config.out === "") throw new TypeError("Output property not specified");
    if((config.key??"").length < 1) throw new SyntaxError("key is not defined in config");
    config.relative = (p)=>path.resolve(path.dirname(con),p);
    if(!(config.key_lock || config.name_lock)) console.warn("[Encryptor]-[Warnning]","Script can't be unlocked when name_lock and key_lock is disabled");
    return config;
}
module.exports={
    loadConfig,
    fileMaker,
    Coder,
    EncryptionKey
}