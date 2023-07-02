export const config_prototype = {
    "regex_filter":"/[^]+\.js$/",
    "external_modules":[],
    "key_lock":false,
    "name_lock":true
};
export const ConfigTypes = {
    "bundle":"bundle",
    "encrypt":"encrypt",
    "core-encrypt":"core-encrypt"
}
export class Config{
    constructor(from,path){

    }
    external_modules = [];
    type  = ConfigTypes.bundle
}
Object.assign(Config.prototype,{
    "external_modules":[],
    "type":ConfigTypes.bundle
});