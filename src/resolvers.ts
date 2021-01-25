import { getCollection, getContract, isValidProtocol } from "./helpers"
import { decodeTokenId, encodeTokenId, parseParcelPosition } from "./land-utils"
import {
  BlockchainAsset,
  OffChainAsset,
  BlockchainCollectionV1Asset,
  BlockchainCollectionV2Asset,
  BlockchainLandAsset,
} from "./types"

export async function resolveLandAsset(
  uri: URL,
  groups: Record<"protocol" | "position", string>
): Promise<BlockchainLandAsset | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, "LandProxy")

  let { x, y } = parseParcelPosition(groups.position)

  if (isNaN(x) || isNaN(y)) {
    const decoded = decodeTokenId(groups.position)
    x = Number(decoded.x)
    y = Number(decoded.y)
  }

  if (isNaN(x) || isNaN(y)) return

  const tokenId = encodeTokenId(x, y)

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

export async function resolveEthereumAsset(
  uri: URL,
  groups: Record<"protocol" | "contract" | "tokenId", string>
): Promise<BlockchainAsset | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, groups.contract)

  if (contract)
    return {
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
    uri,
    blockchain: "ethereum",
    type: "blockchain-collection-v1",
    network: groups.protocol.toLowerCase(),
    collectionsVersion: "v1",
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
      uri,
      blockchain: "ethereum",
      type: "blockchain-collection-v1",
      network: groups.protocol == "ethereum" ? "mainnet" : groups.protocol.toLowerCase(),
      collectionsVersion: "v1",
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
      uri,
      blockchain: "ethereum",
      type: "blockchain-collection-v2",
      network: groups.protocol == "ethereum" ? "mainnet" : groups.protocol.toLowerCase(),
      collectionsVersion: "v2",
      contractAddress: contract,
      id: groups.id,
    }
}
