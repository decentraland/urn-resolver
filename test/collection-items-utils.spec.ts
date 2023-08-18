import expect from 'expect'
import { getTokenIdAndAssetUrn, isExtendedUrn, parseUrn } from '../src'

describe('isExtendedUrn should', () => {
  it('return true when passing a Collection V1 Item URN', async () => {
    const parsedUrn = await parseUrn('urn:decentraland:ethereum:collections-v1:rtfkt_x_atari:p_rtfkt_x_atari_feet:123')
    expect(isExtendedUrn(parsedUrn)).toBe(true)
  })

  it('return true when passing a Collection V2 Item URN', async () => {
    const parsedUrn = await parseUrn(
      'urn:decentraland:mumbai:collections-v2:0x02101c138653a0af06a45b729d9c5d6ba27b8f4a:0:1'
    )
    expect(isExtendedUrn(parsedUrn)).toBe(true)
  })

  it('return false when passing a Collection V1 Asset URN', async () => {
    const parsedUrn = await parseUrn('urn:decentraland:ethereum:collections-v1:rtfkt_x_atari:p_rtfkt_x_atari_feet')
    expect(isExtendedUrn(parsedUrn)).toBe(false)
  })

  it('return false when passing a Collection V2 Asset URN', async () => {
    const parsedUrn = await parseUrn(
      'urn:decentraland:mumbai:collections-v2:0x02101c138653a0af06a45b729d9c5d6ba27b8f4a:0'
    )
    expect(isExtendedUrn(parsedUrn)).toBe(false)
  })

  it('return false when passing a Land URN', async () => {
    const parsedUrn = await parseUrn('urn:decentraland:sepolia:LAND:-10,-13?atBlock=151231111')
    expect(isExtendedUrn(parsedUrn)).toBe(false)
  })

  it('return false when passing a V1 Collection URN', async () => {
    const parsedUrn = await parseUrn('urn:decentraland:ethereum:collections-v1:community_contest')
    expect(isExtendedUrn(parsedUrn)).toBe(false)
  })

  it('return false when passing a V2 Collection URN', async () => {
    const parsedUrn = await parseUrn('urn:decentraland:matic:collections-v2:0x02101c138653a0af06a45b729d9c5d6ba27b8f4a')
    expect(isExtendedUrn(parsedUrn)).toBe(false)
  })
})

describe('getTokenIdAndAssetUrn should', () => {
  it('correctly return the urn from the token id when splitting an Collection V1 Item URN', () => {
    const expectedUrn = 'urn:decentraland:ethereum:collections-v1:rtfkt_x_atari:p_rtfkt_x_atari_feet'
    const expectedTokenId = '123'
    const { assetUrn, tokenId } = getTokenIdAndAssetUrn(`${expectedUrn}:${expectedTokenId}`)

    expect(assetUrn).toBe(expectedUrn)
    expect(tokenId).toBe(expectedTokenId)
  })

  it('correctly return the urn from the token id when splitting an Collection V2 Item URN', () => {
    const expectedUrn = 'urn:decentraland:mumbai:collections-v2:0x02101c138653a0af06a45b729d9c5d6ba27b8f4a:0'
    const expectedTokenId = '1'
    const { assetUrn, tokenId } = getTokenIdAndAssetUrn(`${expectedUrn}:${expectedTokenId}`)

    expect(assetUrn).toBe(expectedUrn)
    expect(tokenId).toBe(expectedTokenId)
  })
})
