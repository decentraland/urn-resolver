# @dcl/urn-resolver

Resolves Asset URN for the `urn:decentraland` namespace following the definition of https://github.com/common-metaverse/urn-namespaces 

```bash
npm i @dcl/urn-resolver
```

```typescript
import { parseUrn } from '@dcl/urn-resolver'

const parsed = await parseUrn("urn:decentraland:ethereum:LANDPROXY:0x1")
=> {
     contract: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
     ethereum: "ethereum",
     tokenId: "0x1",
     url: new URL("urn:decentraland:ethereum:LANDPROXY:0x1")
   }
```