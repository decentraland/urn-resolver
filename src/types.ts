/**
 * @public
 */

export type BaseBlockchainAsset = {
  namespace: 'decentraland'
  uri: URL
  /**
   * Ethereum for the time being.
   */
  blockchain: 'ethereum'
  /**
   * mainnet | sepolia | matic and others.
   */
  network: string
  /**
   * Contract address where to find the asset
   */
  contractAddress: string
}

/**
 * @public
 */
export type BlockchainAsset = BaseBlockchainAsset & {
  type: 'blockchain-asset'
  /**
   * Identifier of the asset. i.e. TokenID for ERC721 contracts
   */
  id: string
}

/**
 * @public
 */
export type BlockchainLandAsset = BlockchainAsset & {
  x: number
  y: number
}

/**
 * @public
 */
export type BlockchainCollectionV1Asset = {
  namespace: 'decentraland'
  uri: URL
  /**
   * Ethereum for the time being.
   */
  blockchain: 'ethereum'
  /**
   * mainnet | sepolia | matic and others.
   */
  network: string
  /**
   * Contract address where to find the asset
   */
  contractAddress: string | null

  type: 'blockchain-collection-v1-asset'
  /**
   * Identifier of the asset (name)
   */
  id: string
  collectionName: string | null
}

/**
 * @public
 */
export type BlockchainCollectionV1Item = Omit<BlockchainCollectionV1Asset, 'type'> & {
  type: 'blockchain-collection-v1-item'
  /**
   * Asset identifier for ERC721 contracts
   */
  tokenId: string
}

/**
 * @public
 */
export type BlockchainCollectionV1 = {
  namespace: 'decentraland'
  uri: URL
  /**
   * Ethereum for the time being.
   */
  blockchain: 'ethereum'
  /**
   * mainnet | sepolia | matic and others.
   */
  network: string

  type: 'blockchain-collection-v1'
  /**
   * Contract address of the collection
   */
  id: string
  collectionName: string | null
}

/**
 * @public
 */
export type BlockchainCollectionV2Asset = BaseBlockchainAsset & {
  namespace: 'decentraland'
  type: 'blockchain-collection-v2-asset'
  /**
   * Identifier of the asset (assetId)
   */
  id: string
}

/**
 * @public
 */
export type BlockchainCollectionV2Item = Omit<BlockchainCollectionV2Asset, 'type'> & {
  type: 'blockchain-collection-v2-item'
  /**
   * Asset identifier for ERC721 contracts
   */
  tokenId: string
}

/**
 * @public
 */
export type BlockchainCollectionV2 = BaseBlockchainAsset & {
  namespace: 'decentraland'
  type: 'blockchain-collection-v2'
  /**
   * Contract address of the collection
   */
  id: string
}

/**
 * @public
 */
export type BlockchainCollectionThirdParty = BaseBlockchainAsset & {
  namespace: 'decentraland'
  type: 'blockchain-collection-third-party'

  thirdPartyName: string
  collectionId: string
  itemId: string
}

/**
 * @public
 */
export type BlockchainCollectionThirdPartyCollection = BaseBlockchainAsset & {
  namespace: 'decentraland'
  type: 'blockchain-collection-third-party-collection'

  thirdPartyName: string
  collectionId: string
}

/**
 * @public
 */
export type BlockchainCollectionThirdPartyName = BaseBlockchainAsset & {
  namespace: 'decentraland'
  type: 'blockchain-collection-third-party-name'

  thirdPartyName: string
}

/**
 * @public
 */
export type OffChainAsset = {
  namespace: 'decentraland'
  uri: URL
  type: 'off-chain'
  /**
   * Name of the registry that hosts the asset.
   */
  registry: string
  /**
   * ID of the asset.
   */
  id: string
}

/**
 * @public
 */
export type EntityV3Asset = {
  namespace: 'decentraland'
  uri: URL
  type: 'entity'
  /**
   * IPFS CID of the entity
   */
  cid: string
  /**
   * Base url of the content server where we can locate the contents of this entity
   */
  baseUrl?: string
}

/**
 * @public
 */
export type DecentralandAssetIdentifier =
  | BlockchainAsset
  | OffChainAsset
  | EntityV3Asset
  | BlockchainCollectionV1Asset
  | BlockchainCollectionV1Item
  | BlockchainCollectionV2Asset
  | BlockchainCollectionV2Item
  | BlockchainLandAsset
  | BlockchainCollectionV1
  | BlockchainCollectionV2
  | BlockchainCollectionThirdPartyName
  | BlockchainCollectionThirdPartyCollection
  | BlockchainCollectionThirdParty
