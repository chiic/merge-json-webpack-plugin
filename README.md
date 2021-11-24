### 用来合并JSON的webpack plugin

```
interface Options {
    reg: string[];
    outDir?: string;
}

```

```
const MergeI18nJSON = require('./MergeI18nJSON');

plugins: [
    ...
    new MergeI18nJSON({
        outDir: 'assets',
        reg: ['zh', 'en']
    })
]


```