import { DecentralandAssetIdentifier } from './types'

const BLOCKCHAIN_ITEM_TYPES = ['blockchain-collection-v1-item', 'blockchain-collection-v2-item']

/**
 * Checks if the URN follows the standard ERC-721 by having the tokenId identifier at the end
 * @public
 */
export function isExtendedUrn(asset: DecentralandAssetIdentifier): boolean {
  return BLOCKCHAIN_ITEM_TYPES.includes(asset.type)
}

/**
 * Takes an URN adhering to the ERC-721 standard and resolves both its asset URN and token identity
 * WARNING: it assumes the URN received follows the ERC-721 standard and that its last part refers to the token id
 * @public
 */
export function getTokenIdAndAssetUrn(completeUrn: string): { assetUrn: string; tokenId: string } {
  const lastColonIndex = completeUrn.lastIndexOf(':')
  const urnValue = completeUrn.slice(0, lastColonIndex)
  return { assetUrn: urnValue, tokenId: completeUrn.slice(lastColonIndex + 1) }
}
