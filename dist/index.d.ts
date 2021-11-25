export interface Options {
    reg: string[];
    from: string;
    baseUrl?: string;
    outDir?: string;
}
export declare class MergeJSON {
    private options;
    constructor(options: Options);
    apply(complier: any): void;
    jsonPath(): {};
    jsonHandler(files: any, basePath: any): {};
    merge(preJson: any, curJson: any): {};
    assets(compilation: any, source: any): void;
}
