interface Options {
    reg: string[];
    outDir?: string;
}
declare class MergeI18nJSON {
    private options;
    constructor(options: Options);
    apply(complier: any): void;
    jsonHandler(assets: any): {};
}
