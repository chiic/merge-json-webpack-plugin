const glob = require("glob");
const fs = require('fs-extra');
const path = require('path');
export interface Options {
    reg: string[];
    from: string;
    baseUrl?: string;
    outDir?: string;
}


export class MergeJSON {
    constructor(private options: Options) { }
    apply(complier) {
        complier.hooks.emit.tapAsync('MergeJSON', (compilation, callback) => {
            const source = this.jsonPath();
            this.assets(compilation, source);
            callback();
        });
    }

    jsonPath() {
        const { from, baseUrl } = this.options;
        if(!from) {
            throw new Error('MergeJSON plugin requires from parameter.');
        }
        let cwd = path.resolve(process.cwd(), baseUrl ? baseUrl : './', from);
        const files = glob.sync('**/*.json', { cwd });
        return this.jsonHandler(files, cwd);
    }
    jsonHandler(files, basePath) {
        let source = {};
        const reg = new RegExp(`(${this.options.reg.join('|')})\.json`);
        for (const key of files) {
            const match = key.match(reg);
            if (match) {
                const obj = fs.readJsonSync(path.resolve(basePath, key));
                const prefix = match[1];
                source[prefix] = source[prefix] ? this.merge(source[prefix], obj) : obj;
            }
        }
        return source;
    }

    merge(preJson, curJson) {
        if(typeof preJson !== 'object' || typeof curJson !== 'object') {
            throw new Error('When use MergeJSON plugin. There are the same parameters in both json files.');
        }
        if(Array.isArray(preJson) && !Array.isArray(curJson) || !Array.isArray(preJson) && Array.isArray(curJson)) {
            throw new Error('When use MergeJSON plugin. Objects and Array cannot be combined.');
        }
        if(Array.isArray(preJson) && Array.isArray(curJson)) {
            return [].concat(preJson, curJson);
        }
        const mergeJson = {};
        const keySet = new Set();
        const k1 = Object.keys(preJson);
        const k2 = Object.keys(curJson);
        for(const k of k1) {
            if(curJson[k]) {
                mergeJson[k] = this.merge(curJson[k], preJson[k]);
                keySet.add(k);
            } else {
                mergeJson[k] = preJson[k];
            }
        }
        for(const m of k2) {
            if(!keySet.has(m)) {
                mergeJson[m] = curJson[m];
            } 
        }
        return mergeJson;
    }

    assets(compilation, source) {
        let outDir = this.options.outDir ?? 'assets/json';
        for(const [key, value] of Object.entries(source)) {
            compilation.assets[`${outDir}/${key}.json`] = {
                source: () => JSON.stringify(value),
                size: () => JSON.stringify(value).length
            }
        }

    }
}
