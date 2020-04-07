# VCManager-Virtualizor

Adapter to Virtualizor End User API

# Installation

```bash
npm i @juniyadi/vcmanager-virtualizor

or

yarn add @juniyadi/vcmanager-virtualizor
```

# How to use

```javascript
const Virtualizor = require('@juniyadi/vcmanager-virtualizor')

const vps = new Virtualizor({
    api: 'https://example-panel.virtualizor.com:4083',
    key: 'ABCDEFGHIJKLMN',
    secret: 'ABCDEFGHIJKLMN',
    raw: true
})

vps.getvps(100)
.then((res) => {
    console.log(res)
})
.catch((err) => {
    console.error(err)
})
```

# Source
- [Virtualizor End User API](https://www.virtualizor.com/docs/enduser-api/)