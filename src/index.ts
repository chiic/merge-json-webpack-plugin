
interface Options {
    reg: string[];
    outDir?: string;
}

class MergeI18nJSON {
    constructor(private options: Options) { }
    apply(complier) {
        complier.hooks.emit.tapAsync('MergeI18nJSON', (compilation, callback) => {
            const source = this.jsonHandler(compilation.assets);
            for (const [key, value] of Object.entries(source)) {
                const { outDir } = this.options;
                compilation.assets[`${outDir}/${key}.json`] = {
                    source: () => JSON.stringify(value),
                    size: () => JSON.stringify(value).length
                };
            }
            callback();
        });
    }
    jsonHandler(assets) {
        const keys = Object.keys(assets);
        let source = {};
        const reg = new RegExp(`(${this.options.reg.join('|')})\.json`);
        for (const key of keys) {
            const match = key.match(reg);
            if (match) {
                const buffer = assets[key].source();
                const obj = JSON.parse(buffer.toString());
                const prefix = match[1];
                source[prefix] = source[prefix] ? Object.assign(Object.assign({}, source[prefix]), obj) : obj;
            }
        }
        return source;
    }
}