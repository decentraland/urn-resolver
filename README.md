# `@dcl/urn-resolver`

Resolves Asset URN for the `urn:decentraland` namespace following the definition of https://github.com/common-metaverse/urn-namespaces

```bash
npm i @dcl/urn-resolver
```

```typescript
import { parseUrn } from '@dcl/urn-resolver'

const parsed = await parseUrn("urn:decentraland:ethereum:LANDPROXY:0x1")
=> DecentralandAssetIdentifier {
  protocol: "ethereum",
  network: "mainnet",
  contract: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
  id: "0x1",
  uri: URL { "urn:decentraland:ethereum:LANDPROXY:0x1" }
}
```

# Registered routes

- `decentraland:off-chain:{registry}:{name}`: Resolve static offchain assets (i.e. base wearables, not in any blockchain nor content server)
- `decentraland:{protocol}:collections:v1:{contract(0x[a-fA-F0-9]+)}:{name}`: Resolve an ethereum wearables collection asset by contract address (v1)
- `decentraland:{protocol}:collections:v1:{collection-name}:{name}`: Resolve an ethereum wearables collection asset by collection name (wearables API) (v1)
- `decentraland:{protocol}:collections:v2:{contract(0x[a-fA-F0-9]+)}:{id}`: Resolve an ethereum wearables collection asset by contract address (v2)
- `decentraland:{protocol}:LAND:{x},{y}`: Resolves the ethereum asset of a LAND position.
- `decentraland:{protocol}:LAND:{tokenId}`: Resolves the ethereum asset of a LAND by tokenId.
- `decentraland:{protocol}:{contract(0x[a-fA-F0-9]+)}:{tokenId}`: Resolve an ethereum asset by contract address
- `decentraland:{protocol}:{contract([a-zA-Z][a-zA-Z_0-9]*)}:{tokenId}`: Resolve an ethereum asset by contract name

# DecentralandAssetIdentifier

It is an union type defined in the file [src/types.ts](src/types.ts), in that file you can find all the possible return types for URN resolution in this package.
