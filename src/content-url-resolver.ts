import { getContract } from "./helpers"
import { LandUtils } from "./land-utils"
import { DecentralandAssetIdentifier } from "./types"

/**
 * @public
 */
export type ResolversOptions = Partial<{
  contentServerHost: string
  wearablesServerHost: string
}>

type ResolverFunction = (
  asset: DecentralandAssetIdentifier,
  config: ResolversOptions
) => string | Promise<string | void> | void

const resolvers: ResolverFunction[] = []

/**
 * Resolves a base URL to locate the asset.
 * This URL may mutate, the URN is immutable.
 * @public
 */
export async function resolveContentUrl(
  asset: DecentralandAssetIdentifier,
  config?: ResolversOptions
): Promise<string | null> {
  if (!asset) return null
  for (let resolver of resolvers) {
    const r = await resolver(asset, config || {})
    if (typeof r == "string" && r.length > 0) {
      return r
    }
  }
  return null
}

// ---------------------------------------------------------------------

resolvers.push(function resolvePortableExperiencesUrl(asset, options) {
  if (asset.type == "off-chain" && asset.registry == "static-portable-experiences") {
    return `https://static-pe.decentraland.io/${asset.id}/mappings`
  }
})

resolvers.push(function (asset, options) {
  if (asset.type == "off-chain" && asset.registry == "unity-renderer-cdn") {
    return `https://cdn.decentraland.org/@dcl/unity-renderer/${asset.id}`
  }
})

resolvers.push(function (asset, options) {
  if (asset.type == "entity") {
    let ipfsBaseUrl =
      asset.baseUrl || `https://${defaultContentServerForNetwork("mainnet", options)}/content/contents/`
    if (!ipfsBaseUrl.endsWith('/')) ipfsBaseUrl = ipfsBaseUrl + '/'
    return new URL(ipfsBaseUrl + asset.cid).toString()
  }
})

resolvers.push(function (asset, options) {
  if (asset.type == "off-chain" && asset.registry == "dcl-cdn") {
    return `https://cdn.decentraland.org/${asset.id}`
  }
})

resolvers.push(function (asset, options) {
  if (asset.type == "off-chain" && asset.registry == "kernel-cdn") {
    return `https://cdn.decentraland.org/@dcl/kernel/${asset.id}`
  }
})

resolvers.push(function (asset, options) {
  if (asset.type == "off-chain" && asset.registry == "explorer-website-cdn") {
    return `https://cdn.decentraland.org/@dcl/explorer-website/${asset.id}`
  }
})

resolvers.push(function (asset, options) {
  if (asset.type == "off-chain" && asset.registry == "base-avatars") {
    const host = defaultWearablesServerForNetwork("ethereum", options)
    return `https://${host}/v2/collections/${asset.registry}/wearables/${asset.id}`
  }
})

resolvers.push(function wearablesV1UrlResolver(asset, options) {
  if (asset.type == "blockchain-collection-v1-asset" && asset.collectionName != "base-avatars") {
    const host = defaultWearablesServerForNetwork(asset.network, options)
    if (asset.collectionName) {
      return `https://${host}/v2/collections/${asset.collectionName}/wearables/${asset.id}`
    }
  }
})

resolvers.push(async function landResolver(asset, options) {
  if (asset.type == "blockchain-asset" &&
      asset.contractAddress.toLowerCase() == (await getContract(asset.network, "LANDProxy"))?.toLowerCase()) {
    const host = defaultContentServerForNetwork(asset.network, options)
    const {x, y} = LandUtils.decodeTokenId(asset.id)
    return `https://${host}/content/entities/scene?pointer=${x},${y}`
  }
})

function defaultContentServerForNetwork(network: string, options: ResolversOptions) {
  if (options.contentServerHost) return options.contentServerHost
  if (network == "goerli") {
    return `peer.decentraland.zone`
  }
  return `peer.decentraland.org`
}

function defaultWearablesServerForNetwork(network: string, options: ResolversOptions) {
  if (options.wearablesServerHost) return options.wearablesServerHost
  if (network == "goerli") {
    return `wearable-api.decentraland.zone`
  }
  return `wearable-api.decentraland.org`
}
