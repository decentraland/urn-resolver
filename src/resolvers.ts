import { createParser, getCollection, getContract, isValidNetwork, RouteMap } from './helpers'
import { LandUtils } from './land-utils'
import {
  BlockchainAsset,
  OffChainAsset,
  BlockchainCollectionV1Asset,
  BlockchainCollectionV2Asset,
  BlockchainLandAsset,
  DecentralandAssetIdentifier,
  BlockchainCollectionV1,
  BlockchainCollectionV2,
  BlockchainCollectionThirdParty,
  BlockchainCollectionThirdPartyCollection,
  BlockchainCollectionThirdPartyName,
  EntityV3Asset,
  BlockchainCollectionV1Item,
  BlockchainCollectionV2Item
} from './types'

/**
 * Ordered map of resolvers.
 * @public
 */
export const resolvers: RouteMap<DecentralandAssetIdentifier> = {
  // Resolver for static offchain assets (quests deployed to static servers, not content server)
  'decentraland:off-chain:{registry}:{name}': resolveOffchainAsset,
  // Resolver for deployed entities. Deployed entities are used to specify portable experience identifiers that may be deployed anywhere in the web.
  'decentraland:entity:{cid}': resolveEntityV3,
  // collections v1 asset (by contract)
  'decentraland:{network}:collections-v1:{contract(0x[a-fA-F0-9]+)}:{name}': resolveCollectionV1Asset,
  // collections v1 item (by asset name and token id)
  'decentraland:{network}:collections-v1:{contract(0x[a-fA-F0-9]+)}:{name}:{tokenId([0-9]+)}': resolveCollectionV1Item,
  // collections v1 asset (by name)
  'decentraland:{network}:collections-v1:{collectionName}:{name}': resolveCollectionV1AssetByCollectionName,
  // collections v1 item (by asset name and token id)
  'decentraland:{network}:collections-v1:{collectionName}:{name}:{tokenId([0-9]+)}':
    resolveCollectionV1ItemByCollectionName,
  // collections v2 asset (hex)
  'decentraland:{network}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id(0x[a-fA-F0-9]+)}': resolveCollectionV2Asset,
  // collections v2 item (by collection hex and token id)
  'decentraland:{network}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id(0x[a-fA-F0-9]+)}:{tokenId([0-9]+)}':
    resolveCollectionV2Item,
  // collections v2 asset (id)
  'decentraland:{network}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id([0-9]+)}': resolveCollectionV2Asset,
  // collections v2 item (by collection asset and token id)
  'decentraland:{network}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id([0-9]+)}:{tokenId([0-9]+)}':
    resolveCollectionV2Item,
  // collections v1 (by contract)
  'decentraland:{network}:collections-v1:{contract(0x[a-fA-F0-9]+)}': resolveCollectionV1,
  // collections v1 (by name)
  'decentraland:{network}:collections-v1:{collectionName}': resolveCollectionV1ByCollectionName,
  // collections v2
  'decentraland:{network}:collections-v2:{contract(0x[a-fA-F0-9]+)}': resolveCollectionV2,
  // resolve LAND by position
  'decentraland:{network}:LAND:{position}': resolveLandAsset,
  // resolve third party names
  'decentraland:{network}:collections-thirdparty:{thirdPartyName}': resolveThirdPartyCollectionName,
  // resolve third party collections
  'decentraland:{network}:collections-thirdparty:{thirdPartyName}:{collectionId}':
    resolveThirdPartyCollectionOnlyCollection,
  // resolve third party assets
  'decentraland:{network}:collections-thirdparty:{thirdPartyName}:{collectionId}:{itemId}': resolveThirdPartyCollection,
  // resolve 721 assets
  'decentraland:{network}:erc721:{contract(0x[a-fA-F0-9]+)}:{tokenId}': resolveErc721Asset
}

export const internalResolver = createParser(resolvers)

export async function resolveLandAsset(
  uri: URL,
  groups: Record<'network' | 'position', string>
): Promise<BlockchainLandAsset | undefined> {
  if (!isValidNetwork(groups.network)) return
  let result: BlockchainLandAsset | undefined = undefined
  const contract = await getContract(groups.network, 'LandProxy')

  let { x, y } = LandUtils.parseParcelPosition(groups.position)

  if (isNaN(x) || isNaN(y)) {
    const decoded = LandUtils.decodeTokenId(groups.position)
    x = Number(decoded.x)
    y = Number(decoded.y)
  }

  if (isNaN(x) || isNaN(y)) return

  const tokenId = LandUtils.encodeTokenId(x, y)

  if (contract) {
    const r = await resolveEthereumAsset(uri, {
      contract,
      network: groups.network.toLowerCase(),
      tokenId: '0x' + tokenId.toString(16)
    })

    if (r) {
      result = {
        ...r,
        x,
        y
      }
    }
  }

  return result
}

export async function resolveErc721Asset(
  uri: URL,
  groups: Record<'network' | 'contract' | 'tokenId', string>
): Promise<BlockchainAsset | undefined> {
  if (!isValidNetwork(groups.network)) return

  const ethereumAsset = await resolveEthereumAsset(uri, {
    contract: groups.contract,
    network: groups.network.toLowerCase(),
    tokenId: groups.tokenId
  })

  return !!ethereumAsset ? ethereumAsset : undefined
}

function parseHostAndPath(uri: URL): { host: string; path: string[] } {
  let host: string
  let path: string[]

  if (uri.pathname.startsWith('//')) {
    // Web URL object does not recognize dcl:// and therefore pathname has an extra /
    const res = uri.pathname.replace(/^\/\//, '').split('/')
    host = res[0]
    path = res.slice(1)
  } else {
    host = uri.host
    path = uri.pathname.replace(/^\//, '').split('/')
  }

  return { host, path }
}

export async function resolveLegacyDclUrl(uri: URL): Promise<DecentralandAssetIdentifier | null> {
  const { host, path } = parseHostAndPath(uri)

  const tokenIdPattern = /^[0-9]+$/

  if (uri.protocol === 'dcl:' && path.length === 1) {
    const tokenId = path.length > 1 ? path[path.length - 1] : null

    if (host === 'base-avatars') {
      return internalResolver(`urn:decentraland:off-chain:base-avatars:${path[0]}`)
    }

    if (host === 'base-emotes') {
      return internalResolver(`urn:decentraland:off-chain:base-emotes:${path[0]}`)
    }

    if (tokenId && tokenIdPattern.test(tokenId)) {
      return internalResolver(`urn:decentraland:ethereum:collections-v1:${host}:${path[0]}:${tokenId}`)
    } else {
      return internalResolver(`urn:decentraland:ethereum:collections-v1:${host}:${path[0]}`)
    }
  }

  return null
}

export async function resolveEthereumAsset(
  uri: URL,
  groups: Record<'network' | 'contract' | 'tokenId', string>
): Promise<BlockchainAsset | undefined> {
  if (!isValidNetwork(groups.network)) return
  let result: BlockchainAsset | undefined = undefined

  const contract = await getContract(groups.network, groups.contract)

  if (contract) {
    result = {
      namespace: 'decentraland',
      uri,
      blockchain: 'ethereum',
      type: 'blockchain-asset',
      network: groups.network === 'ethereum' ? 'mainnet' : groups.network.toLowerCase(),
      contractAddress: contract,
      id: groups.tokenId
    }
  }

  return result
}

export async function resolveOffchainAsset(
  uri: URL,
  groups: Record<'name' | 'registry', string>
): Promise<OffChainAsset | undefined> {
  return {
    namespace: 'decentraland',
    uri,
    type: 'off-chain',
    registry: groups.registry,
    id: groups.name
  }
}

export async function resolveEntityV3(uri: URL, groups: Record<'cid', string>): Promise<EntityV3Asset | undefined> {
  let baseUrl: string | undefined

  if (uri.searchParams.has('baseUrl')) {
    baseUrl = uri.searchParams.get('baseUrl')!
  }

  return {
    namespace: 'decentraland',
    uri,
    type: 'entity',
    cid: groups.cid,
    baseUrl
  }
}

export async function resolveCollectionV1AssetByCollectionName(
  uri: URL,
  groups: Record<'network' | 'collectionName' | 'name', string>
): Promise<BlockchainCollectionV1Asset | undefined> {
  // this only works in mainnet
  if (groups.network !== 'ethereum') return

  const collection = await getCollection(groups.collectionName)

  return {
    namespace: 'decentraland',
    uri,
    blockchain: 'ethereum',
    type: 'blockchain-collection-v1-asset',
    network: 'mainnet',
    contractAddress: (collection && collection.contractAddress) || null,
    id: groups.name,
    collectionName: (collection && collection.collectionId) || groups.collectionName
  }
}

export async function resolveCollectionV1ItemByCollectionName(
  uri: URL,
  groups: Record<'network' | 'collectionName' | 'name' | 'tokenId', string>
): Promise<BlockchainCollectionV1Item | undefined> {
  // this only works in mainnet
  if (groups.network !== 'ethereum') return

  const collection = await getCollection(groups.collectionName)

  return {
    namespace: 'decentraland',
    uri,
    blockchain: 'ethereum',
    type: 'blockchain-collection-v1-item',
    network: 'mainnet',
    contractAddress: (collection && collection.contractAddress) || null,
    id: groups.name,
    collectionName: (collection && collection.collectionId) || groups.collectionName,
    tokenId: groups.tokenId
  } as BlockchainCollectionV1Item
}

export async function resolveCollectionV1Asset(
  uri: URL,
  groups: Record<'network' | 'contract' | 'name', string>
): Promise<BlockchainCollectionV1Asset | undefined> {
  if (!isValidNetwork(groups.network)) return
  let result: BlockchainCollectionV1Asset | undefined = undefined

  const contract = await getContract(groups.network, groups.contract)

  if (contract) {
    const collection = await getCollection(contract)

    result = {
      namespace: 'decentraland',
      uri,
      blockchain: 'ethereum',
      type: 'blockchain-collection-v1-asset',
      network: groups.network === 'ethereum' ? 'mainnet' : groups.network.toLowerCase(),
      contractAddress: contract,
      id: groups.name,
      collectionName: collection ? collection.collectionId : null
    }
  }

  return result
}

export async function resolveCollectionV1Item(
  uri: URL,
  groups: Record<'network' | 'contract' | 'name' | 'tokenId', string>
): Promise<BlockchainCollectionV1Item | undefined> {
  if (!isValidNetwork(groups.network)) return
  let result: BlockchainCollectionV1Item | undefined = undefined

  const contract = await getContract(groups.network, groups.contract)

  if (contract) {
    const collection = await getCollection(contract)

    result = {
      namespace: 'decentraland',
      uri,
      blockchain: 'ethereum',
      type: 'blockchain-collection-v1-item',
      network: groups.network === 'ethereum' ? 'mainnet' : groups.network.toLowerCase(),
      contractAddress: contract,
      id: groups.name,
      collectionName: collection ? collection.collectionId : null,
      tokenId: groups.tokenId
    }
  }

  return result
}

export async function resolveCollectionV2Asset(
  uri: URL,
  groups: Record<'network' | 'contract' | 'id', string>
): Promise<BlockchainCollectionV2Asset | undefined> {
  if (!isValidNetwork(groups.network)) return
  let result: BlockchainCollectionV2Asset | undefined = undefined

  const contract = await getContract(groups.network, groups.contract)

  if (contract) {
    result = {
      namespace: 'decentraland',
      uri,
      blockchain: 'ethereum',
      type: 'blockchain-collection-v2-asset',
      network: groups.network === 'ethereum' ? 'mainnet' : groups.network.toLowerCase(),
      contractAddress: contract,
      id: groups.id
    }
  }

  return result
}

export async function resolveCollectionV2Item(
  uri: URL,
  groups: Record<'network' | 'contract' | 'id' | 'tokenId', string>
): Promise<BlockchainCollectionV2Item | undefined> {
  if (!isValidNetwork(groups.network)) return
  let result: BlockchainCollectionV2Item | undefined = undefined

  const contract = await getContract(groups.network, groups.contract)

  if (contract) {
    result = {
      namespace: 'decentraland',
      uri,
      blockchain: 'ethereum',
      type: 'blockchain-collection-v2-item',
      network: groups.network === 'ethereum' ? 'mainnet' : groups.network.toLowerCase(),
      contractAddress: contract,
      id: groups.id,
      tokenId: groups.tokenId
    }
  }

  return result
}

export async function resolveCollectionV1(
  uri: URL,
  groups: Record<'network' | 'contract', string>
): Promise<BlockchainCollectionV1 | undefined> {
  if (!isValidNetwork(groups.network)) return
  let result: BlockchainCollectionV1 | undefined = undefined

  const contract = await getContract(groups.network, groups.contract)

  if (contract) {
    const collection = await getCollection(contract)

    result = {
      namespace: 'decentraland',
      uri,
      blockchain: 'ethereum',
      type: 'blockchain-collection-v1',
      network: groups.network === 'ethereum' ? 'mainnet' : groups.network.toLowerCase(),
      id: contract,
      collectionName: collection ? collection.collectionId : null
    }
  }

  return result
}

export async function resolveCollectionV1ByCollectionName(
  uri: URL,
  groups: Record<'network' | 'collectionName', string>
): Promise<BlockchainCollectionV1 | undefined> {
  // this only works in mainnet
  if (groups.network !== 'ethereum') return
  let result: BlockchainCollectionV1 | undefined = undefined

  const collection = await getCollection(groups.collectionName)

  if (collection) {
    result = {
      namespace: 'decentraland',
      uri,
      blockchain: 'ethereum',
      type: 'blockchain-collection-v1',
      network: 'mainnet',
      id: collection.contractAddress,
      collectionName: groups.collectionName
    }
  }

  return result
}

export async function resolveCollectionV2(
  uri: URL,
  groups: Record<'network' | 'contract', string>
): Promise<BlockchainCollectionV2 | undefined> {
  let result: BlockchainCollectionV2 | undefined = undefined
  if (!isValidNetwork(groups.network)) return

  const contract = await getContract(groups.network, groups.contract)

  if (contract) {
    result = {
      namespace: 'decentraland',
      uri,
      blockchain: 'ethereum',
      type: 'blockchain-collection-v2',
      network: groups.network === 'ethereum' ? 'mainnet' : groups.network.toLowerCase(),
      contractAddress: contract,
      id: contract
    }
  }

  return result
}

export async function resolveThirdPartyCollection(
  uri: URL,
  groups: Record<'network' | 'thirdPartyName' | 'collectionId' | 'itemId', string>
): Promise<BlockchainCollectionThirdParty | undefined> {
  let result: BlockchainCollectionThirdParty | undefined = undefined
  if (!isValidNetwork(groups.network)) return

  const contract = await getContract(groups.network, 'TPR')

  if (contract) {
    result = {
      namespace: 'decentraland',
      uri,
      blockchain: 'ethereum',
      type: 'blockchain-collection-third-party',
      network: groups.network === 'ethereum' ? 'mainnet' : groups.network.toLowerCase(),
      thirdPartyName: groups.thirdPartyName,
      collectionId: groups.collectionId,
      itemId: groups.itemId,
      contractAddress: contract
    }
  }

  return result
}

export async function resolveThirdPartyCollectionName(
  uri: URL,
  groups: Record<'network' | 'thirdPartyName', string>
): Promise<BlockchainCollectionThirdPartyName | undefined> {
  let result: BlockchainCollectionThirdPartyName | undefined = undefined
  if (!isValidNetwork(groups.network)) return

  const contract = await getContract(groups.network, 'TPR')

  if (contract) {
    result = {
      namespace: 'decentraland',
      uri,
      blockchain: 'ethereum',
      type: 'blockchain-collection-third-party-name',
      network: groups.network === 'ethereum' ? 'mainnet' : groups.network.toLowerCase(),
      thirdPartyName: groups.thirdPartyName,
      contractAddress: contract
    }
  }

  return result
}

export async function resolveThirdPartyCollectionOnlyCollection(
  uri: URL,
  groups: Record<'network' | 'thirdPartyName' | 'collectionId', string>
): Promise<BlockchainCollectionThirdPartyCollection | undefined> {
  let result: BlockchainCollectionThirdPartyCollection | undefined = undefined
  if (!isValidNetwork(groups.network)) return

  const contract = await getContract(groups.network, 'TPR')

  if (contract) {
    result = {
      namespace: 'decentraland',
      uri,
      blockchain: 'ethereum',
      type: 'blockchain-collection-third-party-collection',
      network: groups.network === 'ethereum' ? 'mainnet' : groups.network.toLowerCase(),
      thirdPartyName: groups.thirdPartyName,
      collectionId: groups.collectionId,
      contractAddress: contract
    }
  }

  return result
}
