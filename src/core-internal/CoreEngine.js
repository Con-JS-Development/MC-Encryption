import { Coder } from "./Coder.js";
import { Path } from "./Path.js";

export class EncriptedModule{
    constructor(coded_script, path = new Path("")){
        this.isEvaluted = false;
        this.module = undefined;
        this.encrypt_code = coded_script;
        this.path = path;
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
        let exports = {};
        const module = {
            get exports(){return exports;},
            set exports(ex){exports = ex;}
        };
        Object.preventExtensions(module);
        proccess(this.require.bind(this),module);
        return JSON.stringify(exports);
    }
    require(module){
        if(typeof module !== "string") throw new TypeError("path must be a string.");
        if(module.length < 1) throw new TypeError("Invalid path '" + module + "'.");
        return this.onModuleGet(this.path.relitiveTo(module));
    }
    buildFunction(){
        return EncriptedModule.native_compiler("require","module","propertyRegister",this.code);
    }
    onModuleGet = (path) => {throw new ReferenceError("Module " + path + "doesn't exist.");}
}
EncriptedModule.native_compiler = Function;