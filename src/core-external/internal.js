import * as m from "@minecraft/server";
const charCodeAt = String.call.bind(String.prototype.charCodeAt);
const fromCharCode = String.fromCharCode;
class EncryptionKey{
    constructor(key,encryptionBase = 3e3){
        this.cryptionKey = key??2;
        this.type = typeof key;
        this.base = encryptionBase;
    }
    coreSet(code, index){
        if(this.type == "number") return this.base + code * this.cryptionKey + index;
        if(this.type == "string") return this.base + code * (charCodeAt(this.cryptionKey,index % this.cryptionKey.length) + 1) + (index % this.cryptionKey.length);
    }
    coreGet(code, index){
        if(this.type == "number") return (code - this.base - index)/this.cryptionKey;
        if(this.type == "string") return (code - this.base - (index % this.cryptionKey.length))/(charCodeAt(this.cryptionKey,index % this.cryptionKey.length) + 1);
    }
    /**@param {string} code */
    *decrypt(code){
        for (let i = 0; i < code.length; i++) {
            yield this.coreSet(charCodeAt(code,i),i);
        }
    }
    /**@param {string[]} code */
    *encrypt(code){
        for (let i = 0; i < code.length; i++) {
            yield Sthis.coreGet(charCodeAt(code,i),i);
        }
    }
}
class Coder{
    /**@param {string} code @param {EncryptionKey} key */
    static Code(code, key){
        return fromCharCode(...key.decrypt(code));
    }
    /**@param {string} code @param {EncryptionKey} key */
    static Decode(code, key){
        return fromCharCode(...key.encrypt(code));
    }
}
class EncriptedModule{
    constructor(coded_script, path = new Path(""), onModuleRequire = (path) => {throw new ReferenceError("Module " + path + "doesn't exist.")}){
        this.isEvaluted = false;
        this.module = undefined;
        this.encrypt_code = coded_script;
        this.path = path;
        this.moduleRequire = onModuleRequire;
    }
    setPathAssign(path){
        this.path = path;
    }
    encrypt(key){
        this.code = Coder.Decode(this.encrypt_code, key);
    }
    execute(key){
        if(key) this.encrypt(key);
        const proccess = this.buildFunction();
        delete this.code;
        delete this.encrypt_code;
        let exports = {};
        const module = {
            get exports(){return exports;},
            set exports(ex){exports = ex;}
        };
        pE(module);
        proccess(this.require.bind(this,key),module);
        this.module = exports??{};
        return exports??{};
    }
    importModule(key){
        return this.module??this.execute(key);
    }
    require(key,module){
        if(typeof module !== "string") throw new TypeError("path must be a string.");
        if(module.length < 1) throw new TypeError("Invalid path '" + module + "'.");
        try{var a = this.path.relitiveTo(module);} catch(er){}
        return this.moduleRequire(module,a??undefined,key);
    }
    buildFunction(){return EncriptedModule.native_compiler("require","module","propertyRegister",this.code);}
}
EncriptedModule.native_compiler = Function;
class Path{
    constructor(path){
        this.paths = path.split("/");
    }
    get folderPaths(){
        if(this.paths.length < 2) return [];
        const a = [...this.paths];
        a.pop();
        return a;
    }
    relitiveTo(path){
        const newPath = path.split("/");
        if(newPath[0] !== "." && newPath[0] !== "..") return Path.fromArray(newPath);
        const copyPaths = this.folderPaths;
        if(newPath[0] == ".") {
            newPath.shift();
        }else if(newPath[0] == ".."){
            let relative = true;
            for (const p of [...newPath]) {
                if(p == ".." && relative){
                    if(copyPaths.length < 1) throw new SyntaxError("Invalid relative path provided");
                    newPath.shift();
                    copyPaths.pop();
                }
                break;
            }
        }
        return Path.fromArray([...copyPaths,...newPath]);
    }
    /**@returns {Path} */
    static fromArray(arr){
        const p = Object.create(Path.prototype);
        p.paths = arr;
        return p;
    }
    toString(){return this.paths.join("/");}
    valueOf(){return this.toString();}
}
const {preventExtensions:pE,getOwnPropertyNames:gN} = Object;
function module_require(raw,path,key){
    if(external_modules[raw]) return external_modules[raw];
    if(path == undefined) throw new ReferenceError("Module not found [" + raw +"]");
    const p = path.toString();
    const a = gN(encrypted_modules).find((e)=>e === p || e === p + ".js");
    if(a) return encrypted_modules[a].importModule(key);
    throw new ReferenceError("Module not found [" + raw +"]");
}
const {setDefaultSpawnLocation:sD,getDynamicProperty:gD} = m.world;
m.system.afterEvents.scriptEventReceive.subscribe(({sourceEntity,message,id})=>{
    if(id === "encryption:key" && key_lock === message){
        sD.call(m.world,"encrytion_key",message);
        console.warn("New encryption key defined, use /reload to reload engine session with new encryption key");
    }
    else if(id === "encryption:unlock" && sourceEntity && name_lock){
        sD.call(m.world,"encrytion_key",sourceEntity.name);
        console.warn("New encryption key defined, use /reload to reload engine session with new encryption key");
    }
},{namespaces:"encryption"})
m.world.afterEvents.worldInitialize.subscribe(({propertyRegistry:pr})=>{
    pr.registerWorldDynamicProperties(new m.DynamicPropertiesDefinition().defineString("encrytion_key",255,"0"));
    globalThis.propertyRegistry = pr;
    encrypted_modules[entry].importModule(gD.call(m.world,"encrytion_key"));
    delete globalThis.propertyRegistry;
});

const name_lock = false;
const key_lock = false;
const entry = "";
const external_modules = {};
/**@type {{[key:string]: EncriptedModule}} */
const encrypted_modules = {
    "index.js":new EncriptedModule("",new Path("index.js"),module_require)
}