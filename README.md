# `@dcl/urn-resolver`

Resolves Asset URN for the `urn:decentraland` namespace following the definition of https://github.com/common-metaverse/urn-namespaces

```bash
npm i @dcl/urn-resolver
```

```typescript
import { parseUrn } from '@dcl/urn-resolver'

const parsed = await parseUrn("urn:decentraland:goerli:LAND:-10,-13?atBlock=151231111")
=> {
  uri: URL {
    href: 'urn:decentraland:goerli:LAND:-10,-13?atBlock=151231111',
    protocol: 'urn:',
    pathname: 'decentraland:goerli:LAND:-10,-13',
    search: '?atBlock=151231111',
    searchParams: URLSearchParams { 'atBlock' => '151231111' },
  },
  blockchain: 'ethereum',
  type: 'blockchain-asset',
  network: 'goerli',
  contractAddress: '0x7a73483784ab79257bb11b96fd62a2c3ae4fb75b',
  id: '0xfffffffffffffffffffffffffffffff6fffffffffffffffffffffffffffffff3',
  x: -10,
  y: -13
}
```

# Registered routes

- `decentraland:off-chain:{registry}:{name}`: Resolve static offchain assets (i.e. base wearables, not in any blockchain)
- `decentraland:{protocol}:collections-v1:{contract(0x[a-fA-F0-9]+)}:{name}`: Resolve an ethereum wearables collection asset by contract address (v1)
- `decentraland:{protocol}:collections-v1:{collection-name}:{name}`: Resolve an ethereum wearables collection asset by collection name (wearables API) (v1)
- `decentraland:{protocol}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id}`: Resolve an ethereum wearables collection asset by contract address (v2)
- `decentraland:{protocol}:LAND:{x},{y}`: Resolves the ethereum asset of a LAND position.
- `decentraland:{protocol}:LAND:{tokenId}`: Resolves the ethereum asset of a LAND by tokenId.
- `decentraland:{protocol}:collections-thirdparty:{thirdPartyName}:{collectionId}:{itemId}`: Resolves the ethereum asset of an item of a third party collection, currently only supported on polygon
- `decentraland:{protocol}:collections-thirdparty:{thirdPartyName}:{collectionId}`: Resolves the ethereum asset of a third party collection, currently only supported on polygon
- `decentraland:{protocol}:collections-thirdparty:{thirdPartyName}`: Resolves the ethereum asset of all collections from a third party, currently only supported on polygon

# DecentralandAssetIdentifier

It is an union type defined in the file [src/types.ts](src/types.ts), in that file you can find all the possible return types for URN resolution in this package.

# Contribute

## Install

You will need to install `jq`. If you are using MacOS you can install it by running: `brew install jq`.

The lib is being [built with node 14.x](.github/workflows/ci.yml).

```bash
make build
```

## Test

```bash
make test
```
