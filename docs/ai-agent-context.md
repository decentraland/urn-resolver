# AI Agent Context

**Library Purpose:**

The @dcl/urn-resolver library resolves and parses Decentraland asset URNs (Uniform Resource Names) within the `urn:decentraland` namespace. It provides type-safe parsing of various asset identifiers (LAND, wearables, collections, third-party assets) to structured data for ownership validation, asset resolution, and content URL generation.

**Key Capabilities:**

- Parse URNs for on-chain assets (LAND parcels, NFT wearables, collections v1/v2)
- Parse URNs for off-chain assets (base wearables, third-party collections)
- Resolve URN components (network, contract address, token ID, coordinates)
- Support query parameters in URNs (e.g., `?atBlock=123456`)
- Resolve URNs to content server URLs for fetching asset data
- Provide TypeScript types for all parsed URN structures
- Follow URN namespace definitions from common-metaverse/urn-namespaces
- Support legacy `dcl:` protocol URLs

**Communication Pattern:**

Library/package consumed by other projects (synchronous and asynchronous function calls). No external network calls required for parsing; content URL resolution may use configured content servers.

**Technology Stack:**

- Language: TypeScript
- Runtime: Node.js 18+
- Parsing: Custom URN parsing logic with URL API support
- Build: TypeScript compiler (tsc)
- Testing: Jest

**External Dependencies:**

- None for parsing (pure parsing library)
- Content servers (configurable) for URL resolution

**Supported URN Patterns:**

| Type                   | Pattern                                                                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Off-chain              | `urn:decentraland:off-chain:{registry}:{name}`                                                                                            |
| Collections v1         | `urn:decentraland:{network}:collections-v1:{contract}:{name}`                                                                             |
| Collections v1 Item    | `urn:decentraland:{network}:collections-v1:{contract}:{name}:{tokenId}`                                                                   |
| Collections v2         | `urn:decentraland:{network}:collections-v2:{contract}:{id}`                                                                               |
| Collections v2 Item    | `urn:decentraland:{network}:collections-v2:{contract}:{id}:{tokenId}`                                                                     |
| LAND (coords)          | `urn:decentraland:{network}:LAND:{x},{y}`                                                                                                 |
| LAND (tokenId)         | `urn:decentraland:{network}:LAND:{tokenId}`                                                                                               |
| Third-party Name       | `urn:decentraland:{network}:collections-thirdparty:{thirdPartyName}`                                                                      |
| Third-party Collection | `urn:decentraland:{network}:collections-thirdparty:{thirdPartyName}:{collectionId}`                                                       |
| Third-party Asset      | `urn:decentraland:{network}:collections-thirdparty:{thirdPartyName}:{collectionId}:{itemId}`                                              |
| Third-party Item       | `urn:decentraland:{network}:collections-thirdparty:{thirdPartyName}:{collectionId}:{itemId}:{nftChain}:{nftContractAddress}:{nftTokenId}` |

**Return Types (DecentralandAssetIdentifier union):**

- `BlockchainAsset` - Generic blockchain asset with contract address and token ID
- `BlockchainLandAsset` - LAND parcel with x,y coordinates
- `BlockchainCollectionV1` / `V1Asset` / `V1Item` - Collections v1 hierarchy
- `BlockchainCollectionV2` / `V2Asset` / `V2Item` - Collections v2 hierarchy
- `BlockchainCollectionThirdPartyName` / `ThirdPartyCollection` / `ThirdParty` / `ThirdPartyItem` - Third party hierarchy
- `OffChainAsset` - Off-chain asset (base wearables) with registry and ID
- `EntityV3Asset` - Entity with IPFS CID and optional baseUrl

**Main Exports:**

```typescript
// Core parsing functions
export { parseUrn } from './index' // Parse URN to DecentralandAssetIdentifier
export { resolveUrlFromUrn } from './index' // Resolve URN to content URL

// Utility functions
export { LandUtils } from './land-utils' // LAND coordinate utilities
export { isExtendedUrn } from './collection-items-utils' // Check if URN includes tokenId
export { getTokenIdAndAssetUrn } from './collection-items-utils' // Extract tokenId from URN

// Types
export * from './types' // All DecentralandAssetIdentifier types
```

**Key Concepts:**

- **URN (Uniform Resource Name)**: A persistent identifier for Decentraland assets following the `urn:decentraland:...` format
- **Network**: The blockchain network (mainnet, sepolia, matic/polygon)
- **Collections v1**: Legacy wearable collections deployed on Ethereum mainnet
- **Collections v2**: Current wearable collections deployed on Polygon
- **Third-party Collections**: Linked wearables from external NFT contracts mapped to Decentraland
- **Extended URN**: A URN that includes a tokenId suffix to identify a specific NFT instance
- **Asset vs Item**: Asset refers to the wearable definition; Item refers to a specific NFT instance (with tokenId)
