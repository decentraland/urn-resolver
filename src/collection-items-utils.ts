import { DecentralandAssetIdentifier } from './types'

const BLOCKCHAIN_ITEM_TYPES = ['blockchain-collection-v1-item', 'blockchain-collection-v2-item']

/**
 * Checks if the URN follows the standard ERC-721 by having the tokenId identifier at the end
 * @public
 */
export function isExtendedUrn(asset: DecentralandAssetIdentifier): boolean {
  return BLOCKCHAIN_ITEM_TYPES.includes(asset.type)
}

const QUANTITY_OF_PARTS_ON_SHORTENED_ITEMS_URN = 6
/**
 * Takes an URN adhering to the ERC-721 standard and resolves both its asset URN and token identity
 * WARNING: it assumes the URN received follows the ERC-721 standard and that its last part refers to the token id
 * @public
 */
export function getTokenIdAndAssetUrn(completeUrn: string): { assetUrn: string; tokenId: string | undefined } {
  const lastIndex = completeUrn.lastIndexOf(':')

  return lastIndex !== -1 && completeUrn.split(':').length > QUANTITY_OF_PARTS_ON_SHORTENED_ITEMS_URN
    ? { assetUrn: completeUrn.substring(0, lastIndex), tokenId: completeUrn.substring(lastIndex + 1) }
    : { assetUrn: completeUrn, tokenId: undefined }
}
