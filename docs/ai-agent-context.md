# AI Agent Context

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
