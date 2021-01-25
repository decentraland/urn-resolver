# `@dcl/urn-resolver`

Resolves Asset URN for the `urn:decentraland` namespace following the definition of https://github.com/common-metaverse/urn-namespaces

```bash
npm i @dcl/urn-resolver
```

```typescript
import { parseUrn } from '@dcl/urn-resolver'

const parsed = await parseUrn("urn:decentraland:ropsten:LAND:-10,-13?atBlock=151231111")
=> {
  uri: URL {
    href: 'urn:decentraland:ropsten:LAND:-10,-13?atBlock=151231111',
    protocol: 'urn:',
    pathname: 'decentraland:ropsten:LAND:-10,-13',
    search: '?atBlock=151231111',
    searchParams: URLSearchParams { 'atBlock' => '151231111' },
  },
  blockchain: 'ethereum',
  type: 'blockchain-asset',
  network: 'ropsten',
  contractAddress: '0x7a73483784ab79257bb11b96fd62a2c3ae4fb75b',
  id: '0xfffffffffffffffffffffffffffffff6fffffffffffffffffffffffffffffff3',
  x: -10,
  y: -13
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
