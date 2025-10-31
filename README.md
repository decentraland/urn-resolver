# `@dcl/urn-resolver`

[![Coverage Status](https://coveralls.io/repos/github/decentraland/urn-resolver/badge.svg?branch=main)](https://coveralls.io/github/decentraland/urn-resolver?branch=main) 

The @dcl/urn-resolver library resolves asset URNs within the `urn:decentraland` namespace, following the definitions outlined in the [common-metaverse/urn-namespaces](https://github.com/common-metaverse/urn-namespaces) repository. It supports both on-chain and off-chain assets, such as LAND, wearables, and collections.

# Installation 

Install the package using `npm`: 

```bash
npm i @dcl/urn-resolver
```

Example for how to parse a URN using the library: 
```typescript
import { parseUrn } from '@dcl/urn-resolver'

const parsed = await parseUrn("urn:decentraland:sepolia:LAND:-10,-13?atBlock=151231111")
/*
{
  uri: URL {
    href: 'urn:decentraland:sepolia:LAND:-10,-13?atBlock=151231111',
    protocol: 'urn:',
    pathname: 'decentraland:sepolia:LAND:-10,-13',
    search: '?atBlock=151231111',
    searchParams: URLSearchParams { 'atBlock' => '151231111' }
  },
  blockchain: 'ethereum',
  type: 'blockchain-asset',
  network: 'sepolia',
  contractAddress: '0x7a73483784ab79257bb11b96fd62a2c3ae4fb75b',
  id: '0xfffffffffffffffffffffffffffffff6fffffffffffffffffffffffffffffff3',
  x: -10,
  y: -13
}
*/
```

# Registered routes

- `decentraland:off-chain:{registry}:{name}`: Resolve static offchain assets (i.e. base wearables, not in any blockchain)
- `decentraland:{network}:collections-v1:{contract(0x[a-fA-F0-9]+)}:{name}`: Resolve an ethereum wearables collection asset by contract address (v1)
- `decentraland:{network}:collections-v1:{contract(0x[a-fA-F0-9]+)}:{name}:{tokenId}`: Resolve an ethereum wearable item from collections v1 by contract address and token id
- `decentraland:{network}:collections-v1:{collection-name}:{name}`: Resolve an ethereum wearables collection asset by collection name (wearables API) (v1)
- `decentraland:{network}:collections-v1:{collection-name}:{name}:{tokenId}`: Resolve an ethereum wearable item from collections v1 by collection name and token id
- `decentraland:{network}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id}`: Resolve an ethereum wearables collection asset by contract address (v2)
- `decentraland:{network}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id}:{tokenId}`: Resolve an ethereum wearable item from collections v2 by contract address and token id
- `decentraland:{network}:LAND:{x},{y}`: Resolves the ethereum asset of a LAND position.
- `decentraland:{network}:LAND:{tokenId}`: Resolves the ethereum asset of a LAND by tokenId.
- `decentraland:{network}:collections-thirdparty:{thirdPartyName}`: Resolves the ethereum asset of a third party provider, currently only supported on polygon
- `decentraland:{network}:collections-thirdparty:{thirdPartyName}:{collectionId}`: Resolves the ethereum asset of a third party collection, currently only supported on polygon
- `decentraland:{network}:collections-thirdparty:{thirdPartyName}:{collectionId}:{itemId}`: Resolves the ethereum asset of a third party collection asset, currently only supported on polygon
- `decentraland:{network}:collections-thirdparty:{thirdPartyName}:{collectionId}:{itemId}:{nftChain}:{nftContractAddress(0x[a-fA-F0-9]+)}:{nftTokenId([0-9]+)}`: Resolves the ethereum asset of a third party collection item, currently only supported on polygon

# DecentralandAssetIdentifier

It is an union type defined in the file [src/types.ts](src/types.ts), in that file you can find all the possible return types for URN resolution in this package.

# Contribute

We welcome contributions! Follow the steps below to set up the project for development. 

## Install

You will need to install `jq`. If you are using MacOS you can install it by running: `brew install jq`.

The lib is being [built with node 18.x](.github/workflows/build-and-publish.yml).

```bash
yarn
yarn build
```

## Test

```bash
yarn test
```

## 🤖 AI Agent Context

**Service Purpose:** Resolves and parses Decentraland asset URNs (Uniform Resource Names) within the `urn:decentraland` namespace. Provides type-safe parsing of various asset identifiers (LAND, wearables, collections, third-party assets) to structured data for ownership validation and asset resolution.

**Key Capabilities:**

- Parses URNs for on-chain assets (LAND parcels, NFT wearables, collections v1/v2)
- Parses URNs for off-chain assets (base wearables, third-party collections)
- Resolves URN components (network, contract address, token ID, coordinates)
- Supports query parameters in URNs (e.g., `?atBlock=123456`)
- Provides TypeScript types for all parsed URN structures
- Follows URN namespace definitions from common-metaverse/urn-namespaces

**Communication Pattern:** Library/package consumed by other projects (synchronous function calls)

**Technology Stack:**

- Runtime: Node.js
- Language: TypeScript
- Parsing: Custom URN parsing logic with URL parsing support

**External Dependencies:**

- None (pure parsing library with no external dependencies)

**Supported URN Patterns:**

- Off-chain: `urn:decentraland:off-chain:{registry}:{name}`
- Collections v1/v2: `urn:decentraland:{network}:collections-v1|v2:{contract}:{id}`
- LAND: `urn:decentraland:{network}:LAND:{x},{y}` or `{tokenId}`
- Third-party: `urn:decentraland:{network}:collections-thirdparty:{thirdParty}:{collectionId}:{itemId}`

**Return Types:**

- `BlockchainCollectionV1Asset`
- `BlockchainCollectionV2Asset`
- `BlockchainCollectionThirdParty`
- `OffChainAsset`
- `BlockchainLANDAsset`

**Usage:**

```typescript
const parsed = await parseUrn("urn:decentraland:matic:collections-v2:0x...:1")
// Returns structured object with contractAddress, id, network, etc.
```
