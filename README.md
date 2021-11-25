### 用来合并JSON的webpack plugin

```
interface Options {
    reg: string[];
    from: string;
    baseUrl?: string;
    outDir?: string;
}

```

```
const { MergeJSON, Options } = require('./merge-json-plugin');

plugins: [
    ...
    new MergeJSON({
        outDir: 'assets', // 导出文件夹
        from: 'assets', // 源目标根文件夹
        baseUrl: 'src', // 类似tsconfig, 设置起始文件解析路径
        reg: ['zh', 'en'] // 合并文件名称前缀
    } as Options)
]

```