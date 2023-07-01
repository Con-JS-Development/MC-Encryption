const {Code, Decode, EncryptionKey} = require("../src/Coder.js");
const fs = require("fs");
console.log("Reading...");
const a = fs.readFileSync("./test_script/index.cjs","utf8");
console.log("[Code]",a);
const key = new EncryptionKey("name");
const key2 = new EncryptionKey("namename");
const coded = Code(a,key);
const decoded = Decode(coded,key2);
console.log(coded + "\n" + decoded);