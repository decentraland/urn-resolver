import { getContract } from './helpers'
import { LandUtils } from './land-utils'
import { DecentralandAssetIdentifier } from './types'

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
  for (const resolver of resolvers) {
    const r = await resolver(asset, config || {})
    if (typeof r === 'string' && r.length > 0) {
      return r
    }
  }
  return null
}

// ---------------------------------------------------------------------

resolvers.push(function resolvePortableExperiencesUrl(asset, _options) {
  return asset.type === 'off-chain' && asset.registry === 'static-portable-experiences'
    ? `https://static-pe.decentraland.io/${asset.id}/mappings`
    : undefined
})

resolvers.push(function (asset, _options) {
  return asset.type === 'off-chain' && asset.registry === 'unity-renderer-cdn'
    ? `https://cdn.decentraland.org/@dcl/unity-renderer/${asset.id}`
    : undefined
})

resolvers.push(function (asset, options) {
  let result: string | undefined = undefined

  if (asset.type === 'entity') {
    let ipfsBaseUrl = asset.baseUrl || `https://${defaultContentServerForNetwork('mainnet', options)}/content/contents/`
    if (!ipfsBaseUrl.endsWith('/')) ipfsBaseUrl = ipfsBaseUrl + '/'
    result = new URL(ipfsBaseUrl + asset.cid).toString()
  }

  return result
})

resolvers.push(function (asset, _options) {
  return asset.type === 'off-chain' && asset.registry === 'dcl-cdn'
    ? `https://cdn.decentraland.org/${asset.id}`
    : undefined
})

resolvers.push(function (asset, _options) {
  return asset.type === 'off-chain' && asset.registry === 'kernel-cdn'
    ? `https://cdn.decentraland.org/@dcl/kernel/${asset.id}`
    : undefined
})

resolvers.push(function (asset, _options) {
  return asset.type === 'off-chain' && asset.registry === 'explorer-website-cdn'
    ? `https://cdn.decentraland.org/@dcl/explorer-website/${asset.id}`
    : undefined
})

resolvers.push(function (asset, options) {
  let result: string | undefined = undefined

  if (asset.type === 'off-chain' && asset.registry === 'base-avatars') {
    const host = defaultWearablesServerForNetwork('ethereum', options)
    result = `https://${host}/v2/collections/${asset.registry}/wearables/${asset.id}`
  }

  return result
})

resolvers.push(function wearablesV1UrlResolver(asset, options) {
  let result: string | undefined = undefined

  if (asset.type === 'blockchain-collection-v1-asset' && asset.collectionName !== 'base-avatars') {
    const host = defaultWearablesServerForNetwork(asset.network, options)
    if (asset.collectionName) {
      result = `https://${host}/v2/collections/${asset.collectionName}/wearables/${asset.id}`
    }
  }

  return result
})

resolvers.push(async function landResolver(asset, options) {
  let result: string | undefined = undefined

  if (
    asset.type === 'blockchain-asset' &&
    asset.contractAddress.toLowerCase() === (await getContract(asset.network, 'LANDProxy'))?.toLowerCase()
  ) {
    const host = defaultContentServerForNetwork(asset.network, options)
    const { x, y } = LandUtils.decodeTokenId(asset.id)
    result = `https://${host}/content/entities/scene?pointer=${x},${y}`
  }

  return result
})

function defaultContentServerForNetwork(network: string, options: ResolversOptions) {
  if (options.contentServerHost) return options.contentServerHost
  if (network === 'goerli' || network === 'sepolia') {
    return `peer.decentraland.zone`
  }
  return `peer.decentraland.org`
}

function defaultWearablesServerForNetwork(network: string, options: ResolversOptions) {
  if (options.wearablesServerHost) return options.wearablesServerHost
  if (network === 'goerli' || network === 'sepolia') {
    return `wearable-api.decentraland.zone`
  }
  return `wearable-api.decentraland.org`
}
