export class EncryptionKey{
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
export class Coder{
    /**@param {string} code @param {EncryptionKey} key */
    static Code(code, key){
        return String.fromCharCode(...key.decrypt(code));
    }
    /**@param {string} code @param {EncryptionKey} key */
    static Decode(code, key){
        return String.fromCharCode(...key.encrypt(code));
    }
}