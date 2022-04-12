
import { createParser, getCollection, getContract, isValidProtocol, RouteMap } from "./helpers"
import { LandUtils } from "./land-utils"
import {
  BlockchainAsset,
  OffChainAsset,
  BlockchainCollectionV1Asset,
  BlockchainCollectionV2Asset,
  BlockchainLandAsset,
  DecentralandAssetIdentifier,
  BlockchainCollectionV1,
  BlockchainCollectionV2,
  BlockchainCollectionThirdPartyItem,
  BlockchainCollectionThirdParty
} from "./types"

/**
 * Ordered map of resolvers.
 * @public
 */
export const resolvers: RouteMap<DecentralandAssetIdentifier> = {
  // Resolver for static offchain assets (quests deployed to static servers, not content server)
  "decentraland:off-chain:{registry}:{name}": resolveOffchainAsset,
  // collections v1 asset (by contract)
  "decentraland:{protocol}:collections-v1:{contract(0x[a-fA-F0-9]+)}:{name}": resolveCollectionV1Asset,
  // collections v1 asset (by name)
  "decentraland:{protocol}:collections-v1:{collectionName}:{name}": resolveCollectionV1AssetByCollectionName,
  // collections v2 asset (hex)
  "decentraland:{protocol}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id(0x[a-fA-F0-9]+)}": resolveCollectionV2Asset,
  // collections v2 asset (id)
  "decentraland:{protocol}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id([0-9]+)}": resolveCollectionV2Asset,
  // collections v1 (by contract)
  "decentraland:{protocol}:collections-v1:{contract(0x[a-fA-F0-9]+)}": resolveCollectionV1,
  // collections v1 (by name)
  "decentraland:{protocol}:collections-v1:{collectionName}": resolveCollectionV1ByCollectionName,
  // collections v2
  "decentraland:{protocol}:collections-v2:{contract(0x[a-fA-F0-9]+)}": resolveCollectionV2,
  // resolve LAND by position
  "decentraland:{protocol}:LAND:{position}": resolveLandAsset,
  // resolve third party collections
  "decentraland:{protocol}:collections-thirdparty:{thirdPartyName}:{collectionId}": resolveThirdPartyCollection,
  // resolve third party assets
  "decentraland:{protocol}:collections-thirdparty:{thirdPartyName}:{collectionId}:{itemId}": resolveThirdPartyCollectionItem
}

export const internalResolver = createParser(resolvers)

export async function resolveLandAsset(
  uri: URL,
  groups: Record<"protocol" | "position", string>
): Promise<BlockchainLandAsset | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, "LandProxy")

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
      protocol: groups.protocol.toLowerCase(),
      tokenId: "0x" + tokenId.toString(16),
    })

    if (r)
      return {
        ...r,
        x,
        y,
      }
  }
}

export async function resolveLegacyDclUrl(uri: URL) {
  let host: string
  let path: string[]
  if (uri.pathname.startsWith('//')) {
    // Web URL object does not recognize dcl:// and therefore pathname has an extra /
    let res = uri.pathname.replace(/^\/\//, "").split("/")
    host = res[0]
    path = res.slice(1)
  } else {
    host = uri.host
    path = uri.pathname.replace(/^\//, "").split("/")
  }

  if (uri.protocol == "dcl:" && path.length == 1) {
    if (host == "base-avatars") {
      return internalResolver(`urn:decentraland:off-chain:base-avatars:${path[0]}`)
    } else {
      return internalResolver(`urn:decentraland:ethereum:collections-v1:${host}:${path[0]}`)
    }
  }
}

export async function resolveEthereumAsset(
  uri: URL,
  groups: Record<"protocol" | "contract" | "tokenId", string>
): Promise<BlockchainAsset | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, groups.contract)

  if (contract)
    return {
      namespace: "decentraland",
      uri,
      blockchain: "ethereum",
      type: "blockchain-asset",
      network: groups.protocol == "ethereum" ? "mainnet" : groups.protocol.toLowerCase(),
      contractAddress: contract,
      id: groups.tokenId,
    }
}

export async function resolveOffchainAsset(
  uri: URL,
  groups: Record<"name" | "registry", string>
): Promise<OffChainAsset | void> {
  return {
    namespace: "decentraland",
    uri,
    type: "off-chain",
    registry: groups.registry,
    id: groups.name,
  }
}

export async function resolveCollectionV1AssetByCollectionName(
  uri: URL,
  groups: Record<"protocol" | "collectionName" | "name", string>
): Promise<BlockchainCollectionV1Asset | void> {
  // this only works in mainnet
  if (groups.protocol != "ethereum") return

  const collection = await getCollection(groups.collectionName)

  return {
    namespace: "decentraland",
    uri,
    blockchain: "ethereum",
    type: "blockchain-collection-v1-asset",
    network: 'mainnet',
    contractAddress: (collection && collection.contractAddress) || null,
    id: groups.name,
    collectionName: (collection && collection.collectionId) || groups.collectionName,
  }
}

export async function resolveCollectionV1Asset(
  uri: URL,
  groups: Record<"protocol" | "contract" | "name", string>
): Promise<BlockchainCollectionV1Asset | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, groups.contract)

  if (contract) {
    const collection = await getCollection(contract)

    return {
      namespace: "decentraland",
      uri,
      blockchain: "ethereum",
      type: "blockchain-collection-v1-asset",
      network: groups.protocol == "ethereum" ? "mainnet" : groups.protocol.toLowerCase(),
      contractAddress: contract,
      id: groups.name,
      collectionName: collection ? collection.collectionId : null,
    }
  }
}

export async function resolveCollectionV2Asset(
  uri: URL,
  groups: Record<"protocol" | "contract" | "id", string>
): Promise<BlockchainCollectionV2Asset | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, groups.contract)

  if (contract)
    return {
      namespace: "decentraland",
      uri,
      blockchain: "ethereum",
      type: "blockchain-collection-v2-asset",
      network: groups.protocol == "ethereum" ? "mainnet" : groups.protocol.toLowerCase(),
      contractAddress: contract,
      id: groups.id,
    }
}

export async function resolveCollectionV1(
  uri: URL,
  groups: Record<"protocol" | "contract", string>
): Promise<BlockchainCollectionV1 | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, groups.contract)

  if (contract) {
    const collection = await getCollection(contract)

    return {
      namespace: "decentraland",
      uri,
      blockchain: "ethereum",
      type: "blockchain-collection-v1",
      network: groups.protocol == "ethereum" ? "mainnet" : groups.protocol.toLowerCase(),
      id: contract,
      collectionName: collection ? collection.collectionId : null
    }
  }
}

export async function resolveCollectionV1ByCollectionName(
  uri: URL,
  groups: Record<"protocol" | "collectionName", string>
): Promise<BlockchainCollectionV1 | void> {
  // this only works in mainnet
  if (groups.protocol != "ethereum") return

  const collection = await getCollection(groups.collectionName)

  if (collection) {
    return {
      namespace: "decentraland",
      uri,
      blockchain: "ethereum",
      type: "blockchain-collection-v1",
      network: 'mainnet',
      id: collection.contractAddress,
      collectionName: groups.collectionName,
    }
  }
}

export async function resolveCollectionV2(
  uri: URL,
  groups: Record<"protocol" | "contract", string>
): Promise<BlockchainCollectionV2 | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, groups.contract)

  if (contract)
    return {
      namespace: "decentraland",
      uri,
      blockchain: "ethereum",
      type: "blockchain-collection-v2",
      network: groups.protocol == "ethereum" ? "mainnet" : groups.protocol.toLowerCase(),
      contractAddress: contract,
      id: contract,
    }
}

export async function resolveThirdPartyCollectionItem(
  uri: URL,
  groups: Record<"protocol" | "thirdPartyName" | "collectionId" | "itemId", string>
): Promise<BlockchainCollectionThirdPartyItem | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, "TPR")

  if (contract) {
    return {
      namespace: "decentraland",
      uri,
      blockchain: "ethereum",
      type: "blockchain-collection-third-party",
      network: groups.protocol == "ethereum" ? "mainnet" : groups.protocol.toLowerCase(),
      thirdPartyName: groups.thirdPartyName,
      collectionId: groups.collectionId,
      itemId: groups.itemId,
      contractAddress: contract 
    }  
  }
}


export async function resolveThirdPartyCollection(
  uri: URL,
  groups: Record<"protocol" | "thirdPartyName" | "collectionId" | "itemId", string>
): Promise<BlockchainCollectionThirdParty | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, "TPR")

  if (contract) {
    return {
      namespace: "decentraland",
      uri,
      blockchain: "ethereum",
      type: "blockchain-collection-third-party-collection",
      network: groups.protocol == "ethereum" ? "mainnet" : groups.protocol.toLowerCase(),
      thirdPartyName: groups.thirdPartyName,
      collectionId: groups.collectionId,
      contractAddress: contract 
    }  
  }
}
