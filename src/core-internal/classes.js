const{preventExtensions:pE}=Object;
class EncryptionKey{
    constructor(key,encryptionBase = 3e3){
        this.cryptionKey = key??2;
        this.type = typeof key;
        this.base = encryptionBase;
    }
    coreSet(code, index){
        if(this.type == "number") return this.base + code * this.cryptionKey + index;
        if(this.type == "string") return this.base + code * (this.cryptionKey.charCodeAt(index % this.cryptionKey.length) + 1) + (index % this.cryptionKey.length);
    }
    coreGet(code, index){
        if(this.type == "number") return (code - this.base - index)/this.cryptionKey;
        if(this.type == "string") return (code - this.base - (index % this.cryptionKey.length))/(this.cryptionKey.charCodeAt(index % this.cryptionKey.length) + 1);
    }
    /**@param {string} code */
    *decrypt(code){
        for (let i = 0; i < code.length; i++) {
            yield this.coreSet(code.charCodeAt(i),i);
        }
    }
    /**@param {string[]} code */
    *encrypt(code){
        for (let i = 0; i < code.length; i++) {
            yield Sthis.coreGet(code.charCodeAt(i),i);
        }
    }
}
class Coder{
    /**@param {string} code @param {EncryptionKey} key */
    static Code(code, key){
        return String.fromCharCode(...key.decrypt(code));
    }
    /**@param {string} code @param {EncryptionKey} key */
    static Decode(code, key){
        return String.fromCharCode(...key.encrypt(code));
    }
}
class EncryptedModule{
    constructor(e,t=new Path(""),r=e=>{throw ReferenceError("Module "+e+"doesn't exist.")})
    {this.isEvaluted=!1,this.module=void 0,this.encrypt_code=e,this.path=t,this.moduleRequire=r}
    setPathAssign(e){this.path=e}encrypt(e){this.code=Coder.Decode(this.encrypt_code,e)}
    execute(e){e&&this.encrypt(e);let t=this.buildFunction();delete this.code,delete this.encrypt_code;let r={},i={get exports(){return r},set exports(ex){r=ex}};return pE(i),t(this.require.bind(this,e),i),this.module=r??{},r??{}}
    importModule(e){return this.module??this.execute(e)}
    require(e,t){if("string"!=typeof t)throw TypeError("path must be a string.");if(t.length<1)throw TypeError("Invalid path '"+t+"'.");try{var r=this.path.relitiveTo(t)}catch(i){}return this.moduleRequire(t,r??void 0,e)}
    buildFunction(){return EM.native_compiler("require","module","propertyRegister",this.code)}
}
EncryptedModule.native_compiler=Function;
class Path{
    constructor(e){this.paths=e.split("/")}
    get folderPaths(){if(this.paths.length<2)return[];let e=[...this.paths];return e.pop(),e}
    relitiveTo(e){let t=e.split("/");if("."!==t[0]&&".."!==t[0])return Path.fromArray(t);let r=this.folderPaths;if("."==t[0])t.shift();else if(".."==t[0])for(let i of[...t]){if(".."==i){if(r.length<1)throw SyntaxError("Invalid relative path provided");t.shift(),r.pop()}break}return Path.fromArray([...r,...t])}static fromArray(e){let t=Object.create(Path.prototype);return t.paths=e,t}
    toString(){return this.paths.join("/")}
    valueOf(){return this.toString()}
}