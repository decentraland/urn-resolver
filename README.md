# `@dcl/urn-resolver`

[![Coverage Status](https://coveralls.io/repos/github/decentraland/urn-resolver/badge.svg?branch=main)](https://coveralls.io/github/decentraland/urn-resolver?branch=main)

A TypeScript library that resolves and parses Decentraland asset URNs (Uniform Resource Names) within the `urn:decentraland` namespace, following the definitions outlined in the [common-metaverse/urn-namespaces](https://github.com/common-metaverse/urn-namespaces) repository. It supports both on-chain and off-chain assets, such as LAND, wearables, and collections.

## Table of Contents

- [Features](#features)
- [Dependencies & Related Services](#dependencies--related-services)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Parsing URNs](#parsing-urns)
  - [Resolving Content URLs](#resolving-content-urls)
- [Registered Routes](#registered-routes)
- [Return Types](#return-types)
- [Testing](#testing)
- [Contributing](#contributing)

## Features

- **URN Parsing**: Parse URNs for on-chain assets (LAND parcels, NFT wearables, collections v1/v2)
- **Off-chain Support**: Parse URNs for off-chain assets (base wearables, third-party collections)
- **Component Resolution**: Resolve URN components (network, contract address, token ID, coordinates)
- **Query Parameters**: Support for query parameters in URNs (e.g., `?atBlock=123456`)
- **Content URL Resolution**: Resolve URNs to content server URLs
- **TypeScript Types**: Provides type-safe structures for all parsed URN results
- **Standards Compliant**: Follows URN namespace definitions from common-metaverse/urn-namespaces

## Dependencies & Related Services

This library has no external service dependencies. It is a pure parsing library that can be used offline.

## Getting Started

### Prerequisites

- **Node.js**: Version 18.x or higher
- **yarn**: For package management

### Installation

```bash
npm install @dcl/urn-resolver
```

or with yarn:

```bash
yarn add @dcl/urn-resolver
```

## Usage

### Parsing URNs

Use the `parseUrn` function to parse a Decentraland URN into a structured object:

```typescript
import { parseUrn } from '@dcl/urn-resolver'

const parsed = await parseUrn('urn:decentraland:sepolia:LAND:-10,-13?atBlock=151231111')
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

### Resolving Content URLs

Use the `resolveUrlFromUrn` function to resolve a URN to a content server URL:

```typescript
import { resolveUrlFromUrn } from '@dcl/urn-resolver'

const url = await resolveUrlFromUrn('urn:decentraland:matic:collections-v2:0x....:1')
// Returns the content URL where the asset can be fetched
```

### Utility Functions

```typescript
import { LandUtils, isExtendedUrn, getTokenIdAndAssetUrn } from '@dcl/urn-resolver'

// Check if a URN is an extended URN (includes tokenId)
const isExtended = isExtendedUrn('urn:decentraland:matic:collections-v2:0x...:1:123')

// Extract tokenId and asset URN from an extended URN
const { tokenId, assetUrn } = getTokenIdAndAssetUrn('urn:decentraland:matic:collections-v2:0x...:1:123')
```

## Registered Routes

The library supports the following URN patterns:

| Pattern                                                                                                                               | Description                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `decentraland:off-chain:{registry}:{name}`                                                                                            | Resolve static offchain assets (i.e. base wearables, not in any blockchain)            |
| `decentraland:{network}:collections-v1:{contract(0x[a-fA-F0-9]+)}:{name}`                                                             | Resolve an ethereum wearables collection asset by contract address (v1)                |
| `decentraland:{network}:collections-v1:{contract(0x[a-fA-F0-9]+)}:{name}:{tokenId}`                                                   | Resolve an ethereum wearable item from collections v1 by contract address and token id |
| `decentraland:{network}:collections-v1:{collection-name}:{name}`                                                                      | Resolve an ethereum wearables collection asset by collection name (wearables API) (v1) |
| `decentraland:{network}:collections-v1:{collection-name}:{name}:{tokenId}`                                                            | Resolve an ethereum wearable item from collections v1 by collection name and token id  |
| `decentraland:{network}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id}`                                                               | Resolve an ethereum wearables collection asset by contract address (v2)                |
| `decentraland:{network}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id}:{tokenId}`                                                     | Resolve an ethereum wearable item from collections v2 by contract address and token id |
| `decentraland:{network}:LAND:{x},{y}`                                                                                                 | Resolves the ethereum asset of a LAND position                                         |
| `decentraland:{network}:LAND:{tokenId}`                                                                                               | Resolves the ethereum asset of a LAND by tokenId                                       |
| `decentraland:{network}:collections-thirdparty:{thirdPartyName}`                                                                      | Resolves the ethereum asset of a third party provider (polygon only)                   |
| `decentraland:{network}:collections-thirdparty:{thirdPartyName}:{collectionId}`                                                       | Resolves the ethereum asset of a third party collection (polygon only)                 |
| `decentraland:{network}:collections-thirdparty:{thirdPartyName}:{collectionId}:{itemId}`                                              | Resolves the ethereum asset of a third party collection asset (polygon only)           |
| `decentraland:{network}:collections-thirdparty:{thirdPartyName}:{collectionId}:{itemId}:{nftChain}:{nftContractAddress}:{nftTokenId}` | Resolves the ethereum asset of a third party collection item (polygon only)            |

## Return Types

The `parseUrn` function returns a `DecentralandAssetIdentifier` union type. All possible return types are defined in [src/types.ts](src/types.ts):

- `BlockchainAsset` - Generic blockchain asset
- `BlockchainLandAsset` - LAND parcel with x,y coordinates
- `BlockchainCollectionV1` - Collections v1 collection
- `BlockchainCollectionV1Asset` - Collections v1 asset (wearable definition)
- `BlockchainCollectionV1Item` - Collections v1 item (NFT instance)
- `BlockchainCollectionV2` - Collections v2 collection
- `BlockchainCollectionV2Asset` - Collections v2 asset (wearable definition)
- `BlockchainCollectionV2Item` - Collections v2 item (NFT instance)
- `BlockchainCollectionThirdPartyName` - Third party provider
- `BlockchainCollectionThirdPartyCollection` - Third party collection
- `BlockchainCollectionThirdParty` - Third party asset
- `BlockchainCollectionThirdPartyItem` - Third party item (linked wearable)
- `OffChainAsset` - Off-chain asset (base wearables)
- `EntityV3Asset` - Entity with IPFS CID

## Testing

Run all tests:

```bash
yarn test
```

### Test Structure

Tests are located in the `test/` directory:

```
test/
  collection-items-utils.spec.ts
  land-utils.spec.ts
  parse-urn.spec.ts
  resolve-url-from-urn.spec.ts
```

## Contributing

We welcome contributions! Follow the steps below to set up the project for development.

### Prerequisites

You will need to install `jq`. If you are using MacOS you can install it by running:

```bash
brew install jq
```

### Build

The library is being built with Node.js 18.x.

```bash
yarn
yarn build
```

## AI Agent Context

For detailed AI Agent context, see [docs/ai-agent-context.md](docs/ai-agent-context.md).

---
