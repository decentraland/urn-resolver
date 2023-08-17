import { internalResolver, resolveLegacyDclUrl } from './resolvers'
import { DecentralandAssetIdentifier } from './types'
export * from './types'
export { LandUtils } from './land-utils'
import { resolveContentUrl, ResolversOptions } from './content-url-resolver'
export { resolveContentUrl, ResolversOptions }
export { isExtendedUrn, getTokenIdAndAssetUrn } from './collection-items-utils'

/**
 * Function that parses an URN and returns a DecentralandAssetIdentifier record or null.
 * @public
 */
export async function parseUrn(urn: string): Promise<DecentralandAssetIdentifier | null> {
  const url = new URL(urn)

  if (url.protocol === 'urn:') return internalResolver(urn)
  if (url.protocol === 'dcl:') return (await resolveLegacyDclUrl(url)) || null

  return null
}

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
