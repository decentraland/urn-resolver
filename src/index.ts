import { createParser, RouteMap } from "./helpers"
import {
  resolveCollectionV1Asset,
  resolveCollectionV1AssetByCollectionName,
  resolveCollectionV2Asset,
  resolveEthereumAsset,
  resolveLandAsset,
  resolveOffchainAsset,
} from "./resolvers"
import { DecentralandAssetIdentifier } from "./types"
export * from "./types"
export { RouteMap } from "./helpers"
export { decodeTokenId, encodeTokenId, parseParcelPosition } from "./land-utils"
export { resolveContentUrl, ResolversOptions } from "./content-url-resolver"
import { resolveContentUrl, ResolversOptions } from "./content-url-resolver"

/**
 * Ordered map of resolvers.
 * @public
 */
export const resolvers: RouteMap<DecentralandAssetIdentifier> = {
  // Resolver for static offchain assets (quests deployed to static servers, not content server)
  "decentraland:off-chain:{registry}:{name}": resolveOffchainAsset,
  // collections v1 (by contract)
  "decentraland:{protocol}:collections:v1:{contract(0x[a-fA-F0-9]+)}:{name}": resolveCollectionV1Asset,
  // collections v1 (by name)
  "decentraland:{protocol}:collections:v1:{collectionName}:{name}": resolveCollectionV1AssetByCollectionName,
  // collections v2 (hex)
  "decentraland:{protocol}:collections:v2:{contract(0x[a-fA-F0-9]+)}:{id(0x[a-fA-F0-9]+)}": resolveCollectionV2Asset,
  // collections v2 (id)
  "decentraland:{protocol}:collections:v2:{contract(0x[a-fA-F0-9]+)}:{id([0-9]+)}": resolveCollectionV2Asset,
  // resolve LAND by position
  "decentraland:{protocol}:LAND:{position}": resolveLandAsset,
  // resolve smart contract by address
  "decentraland:{protocol}:{contract(0x[a-fA-F0-9]+)}:{tokenId}": resolveEthereumAsset,
  // resolve smart contract by name
  "decentraland:{protocol}:{contract([a-zA-Z][a-zA-Z_0-9]*)}:{tokenId}": resolveEthereumAsset,
}

/**
 * Function that parses an URN and returns a DecentralandAssetIdentifier record or null.
 * @public
 */
export const parseUrn: (urn: string) => Promise<DecentralandAssetIdentifier | null> = createParser(resolvers)

/**
 * Returns a resolved (and mutable) content-url for the immutable URN.
 * @public
 */
export async function resolveUrlFromUrn(urn: string, options?: ResolversOptions): Promise<string | null> {
  const parsedUrn = await parseUrn(urn)

  if (parsedUrn) {
    return resolveContentUrl(parsedUrn, options)
  }

  return null
}
