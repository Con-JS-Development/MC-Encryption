export class Path{
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