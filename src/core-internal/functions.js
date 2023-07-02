
import fs from "fs";

export function randomString(length=10) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export function *getFiles(from, base = undefined){
    for(const a of fs.readdirSync([...arguments].join("/"),{withFileTypes:true})){
        if(a.isFile() && a.name.endsWith(".js")) yield base?base + "/" + a.name:a.name;
        if(a.isDirectory()) yield * getFiles(from, base?base + "/" + a.name:a.name);
    }
}