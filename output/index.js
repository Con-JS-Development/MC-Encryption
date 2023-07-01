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
};const guarded_modules = {"index.js": new EncriptedModule(`㈁㱉㙄㠱㹹᠚㦽㘩㟐᠘♩᠚ᣞ㹹㋉㠱㹹ᣠ⊉`,new Path("index.js")),"jobs/john.js": new EncriptedModule(``,new Path("jobs/john.js")),"john.js": new EncriptedModule(`㑓㭩㜊㚥㶙㢖᠘䆉᠚♧㯙㈃㟎㦩㜊㢔㟩㉦⥿㱉㉦㣷㫹㋉᠘䉩᠚㌪㶙㚧㗟ᦹᣠᶂῙᷧ㈁㱉㟐㋇Ὡ㑕㙂㹹㋉㟎㯙ㄽ㕼⁉㑕㙂㝹㋉㨠Ῑ㒸㠱᪙⊋Ⴟမ㋉㨠㲹㚧㟎㹹᠚㉤㟩㌬ㄻ㻩㕾㢔ᦹ㙄㋇㿉᠚♧㯙㈃㟎㦩㜊㢔㟩㉦⥿㱉㉦㣷㫹㋉ᬰ᪙ậẫ≹ậ‷▉ậ῔∉ἐά▉ậ‷⏉ₜἎ▉ậₚ≹‹Ⅰ▉ậἎ␹ₜṈ▉ₜἎ⍙‹⊉℩ῖⅠ∉ῖ⊉℩ₜ῔⋩Ⅲ⊉⋩⃿Ἆ₹⊋⇃↙ἐά▉ₜ⃽℩ῖ⊉℩ₜά≹ậ⊉℩ậ‷␹‹⊉℩ῖ‷↙⃿⊉℩ₜ‷⏉ῖ⊉℩‹Ἆ␹Ⅲ⊉℩ἐₚ⒩Ṋ⊉℩έά₹έ⊉⏉ₜ῔↙⊋ₚ⒩Ⅲẫ▉ậẫ⍙⃿Ṉ▉ậ῔⏉έẫ▉ₜ⇃≹ₜ⊉⏉ⅢṈ₹⊋Ⅰ₹ậ‷▉ῖά↙⃿⊉≹ậₚ↙⊋ẫ≹‹Ⅰ⍙⊋ẫ↙ῖά⋩⊋ẫ≹ἐἎ℩⊋ẫ⍙έ῔↙⊋ẫ⋩⇅⇃₹⊋ẫ↙ậⅠ₹⊋ẫ∉έṈ∉⊋Ⅰ∉έⅠ▉ậ‷⍙έ⇃▉ậἎ≹έ‷▉ậά⋩Ṋ⃽▉⃿ₚ≹ἐ⊉℩ῖ⇃∉⃿⊉℩ἐ⃽⏉‹⊉⏉ậⅠ∉⊋⇃␹ῖₚ▉ῖ‷↙ῖ⊉∉Ⅲ‷₹⊋ẫ≹ậẫ⒩⊋ẫ⋩Ⅲ⃽␹⊋ẫ≹⃿Ṉ∉⊋ẫ↙⇅῔⋩⊋ẫ≹Ṋẫ⏉⊋ẫ≹⃿ẫ␹⊋Ⅰ∉Ⅲ‷▉ậẫ⋩Ⅲ‷▉ậ‷↙ῖẫ▉ậ‷⒩⇅῔▉ậ‷⒩⇅Ṉ▉ậἎ⍙⇅Ṉ▉ậ῔␹έά▉ậₚ∉ῖἎ▉ₜ⃽≹⃿⊉␹ậⅠ⋩⊋ₚ↙ₜ‷▉ậ⃽↙⃿Ṉ▉ῖ‷↙ῖ⊉∉Ⅲ‷₹⊋ₚ↙ₜ‷▉ₜ⃽℩ῖ⊉⍙⃿῔⏉⊋‷⏉ἐṈ▉ậἎ␹⇅‷▉⇅⃽∉Ṋ⊉⒩ἐṈ≹⊋ₚ⏉ῖṈ▉ῖά↙⃿⊉≹ậₚ↙⊋ₚ⏉ῖ⃽▉‹⃽↙Ṋ⊉⍙ἐₚ⋩⊋ₚ⏉ậ῔▉ậₚ⋩⃿‷▉ậẫ⋩Ⅲ‷▉ậ῔⏉έẫ▉ậₚ≹‹Ⅰ▉⇅⃽␹⇅⊉⏉‹Ṉ⋩⊋῔∉ἐ⃽▉ῖẫ⍙ἐ⊉℩⃿ₚ↙Ⅲᣞᶩ⊋`,new Path("john.js")),};const module_paths = {};