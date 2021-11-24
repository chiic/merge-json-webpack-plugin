export interface Options {
    reg: string[];
    outDir?: string;
}
export declare class MergeI18nJSON {
    private options;
    constructor(options: Options);
    apply(complier: any): void;
    jsonHandler(assets: any): {};
}
