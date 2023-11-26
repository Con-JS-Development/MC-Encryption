export class Random{
    constructor(seed){
        this.states = [seed,seed + 1];
    }
    stater(args){
        let [s1,s0] = args;
        args[0] = s0;
        s1 ^= s1 << 23;
        args[1] = s1 ^ s0 ^ (s1 >> 17) ^ (s0 >> 26);
        return args;
    }
    next(a){
        if(a) return (function*(a){for (let i = 0; i < a; i++) yield this.next().value; }).call(this,a);
        else return {value: this.stater(this.states)[1],done:false};
    }
    [Symbol.iterator](){return this;}
}