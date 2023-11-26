const{preventExtensions:pE}=Object;
class EncryptionKey{
    static *xorshift128(state0, state1) {
        function stater(state0,state1) {
          let s1 = state0;
          let s0 = state1;
          state0 = s0;
          s1 ^= s1 << 23;
          state1 = s1 ^ s0 ^ (s1 >> 17) ^ (s0 >> 26);
          return [state0, state1];
        }
        let states = [state0,state1];
        while (true) {
            states = stater(...states);
            yield states[0];
        }
    }
    static sha256(str) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        };
        let mathPow = Math.pow;
        let maxWord = mathPow(2, 32);
        let lengthProperty = 'length'
        let i, j; // Used as a counter across the whole file
        let result = []
    
        let words = [];
        let strBitLength = str[lengthProperty] * 8;
    
        var hash = sha256.h = sha256.h || [];
        var k = sha256.k = sha256.k || [];
        var primeCounter = k[lengthProperty];
    
        var isComposite = {};
        for (var candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 313; i += candidate) {
                    isComposite[i] = candidate;
                }
                hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }
    
        str += '\x80' // Append Ƈ' bit (plus zero padding)
        while (str[lengthProperty] % 64 - 56) str += '\x00' // More zero padding
        for (i = 0; i < str[lengthProperty]; i++) {
            j = str.charCodeAt(i);
            words[i >> 2] |= j << (((3 - i) % 4) * 8);
        }
        words[words[lengthProperty]] = ((strBitLength / maxWord) | 0);
        words[words[lengthProperty]] = (strBitLength)
    
        // process each chunk
        for (j = 0; j < words[lengthProperty];) {
            var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
            var oldHash = hash;
            hash = hash.slice(0, 8);
    
            for (i = 0; i < 64; i++) {
                var i2 = i + j;
                var w15 = w[i - 15],
                    w2 = w[i - 2];
    
                var a = hash[0],
                    e = hash[4];
                var temp1 = hash[7] +
                    (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
                    ((e & hash[5]) ^ ((~e) & hash[6])) +
                    k[i] +
                    (w[i] = (i < 16) ? w[i] : (
                        w[i - 16] +
                        (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                        w[i - 7] +
                        (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                    ) | 0);
                var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
                    ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
    
                hash = [(temp1 + temp2) | 0].concat(hash);
                hash[4] = (hash[4] + temp1) | 0;
            }
    
            for (i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i]) | 0;
            }
        }
    
        for (i = 0; i < 8; i++) {
            result.push(hash[i]);
        }
        
        return result;
    }
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