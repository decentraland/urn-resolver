import expect from 'expect'
import { RFC2141 } from 'urn-lib'
import { ResolversOptions, resolveUrlFromUrn } from '../src'

function test(urn: string, contentUrl: string | null, options?: ResolversOptions) {
  it(urn, async () => {
    expect(RFC2141.parse(urn)).toBeTruthy()
    expect(await resolveUrlFromUrn(urn, options)).toEqual(contentUrl)
  })
}

describe('Content url generation', function () {
  test('decentraland:off-chain:something:something-else', null)
  test(
    'urn:decentraland:off-chain:static-portable-experiences:quest-1',
    'https://static-pe.decentraland.io/quest-1/mappings'
  )
  test(
    'urn:decentraland:off-chain:unity-renderer-cdn:0.0.0-123123123-badaeafa',
    'https://cdn.decentraland.org/@dcl/unity-renderer/0.0.0-123123123-badaeafa'
  )
  test(
    'urn:decentraland:off-chain:kernel-cdn:0.0.0-123123123-badaeafa',
    'https://cdn.decentraland.org/@dcl/kernel/0.0.0-123123123-badaeafa'
  )
  test(
    'urn:decentraland:entity:bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki?baseUrl=https://ipfs.com/ipfs',
    'https://ipfs.com/ipfs/bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki'
  )
  // ADR-207
  test(
    'urn:decentraland:entity:bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki?=dcl&baseUrl=https://ipfs.com/ipfs',
    'https://ipfs.com/ipfs/bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki'
  )
  test(
    'urn:decentraland:entity:bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki?=&baseUrl=https://ipfs.com/ipfs',
    'https://ipfs.com/ipfs/bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki'
  )
  test(
    'urn:decentraland:entity:bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki?baseUrl=https://ipfs.com/ipfs',
    'https://ipfs.com/ipfs/bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki'
  )
  test(
    'urn:decentraland:entity:bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki?baseUrl=https://ipfs.com/ipfs/',
    'https://ipfs.com/ipfs/bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki'
  )
  test(
    'urn:decentraland:entity:bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki',
    'https://peer.decentraland.org/content/contents/bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki'
  )
  test(
    'urn:decentraland:off-chain:dcl-cdn:@dcl/kernel/0.0.0-123123123-badaeafa',
    'https://cdn.decentraland.org/@dcl/kernel/0.0.0-123123123-badaeafa'
  )
  test(
    'urn:decentraland:off-chain:explorer-website-cdn:0.0.0-123123123-badaeafa',
    'https://cdn.decentraland.org/@dcl/explorer-website/0.0.0-123123123-badaeafa'
  )
  test(
    'urn:decentraland:ethereum:LAND:4763953136893138488487244504044754960247',
    'https://peer.decentraland.org/content/entities/scene?pointer=13,-137'
  )
  test(
    'urn:decentraland:sepolia:LAND:4763953136893138488487244504044754960247',
    'https://peer.decentraland.zone/content/entities/scene?pointer=13,-137'
  )
  test(
    'urn:decentraland:sepolia:LAND:4763953136893138488487244504044754960247',
    'https://localhost:7666/content/entities/scene?pointer=13,-137',
    { contentServerHost: 'localhost:7666' }
  )
  test('urn:decentraland:sepolia:LAND:-10,-13', 'https://peer.decentraland.zone/content/entities/scene?pointer=-10,-13')

  test(
    'urn:decentraland:ethereum:collections-v1:community_contest:cw_bell_attendant_hat',
    'https://wearable-api.decentraland.org/v2/collections/community_contest/wearables/cw_bell_attendant_hat'
  )

  test('urn:decentraland:ethereum:collections-v1:base-avatars:eyes_03', null)

  test(
    'urn:decentraland:off-chain:base-avatars:eyes_03',
    'https://wearable-api.decentraland.org/v2/collections/base-avatars/wearables/eyes_03'
  )

  test(
    'dcl://base-avatars/eyes_03',
    'https://wearable-api.decentraland.org/v2/collections/base-avatars/wearables/eyes_03'
  )

  test(
    'urn:decentraland:ethereum:collections-v1:0x32b7495895264ac9d0b12d32afd435453458b1c6:cw_bell_attendant_hat',
    'https://wearable-api.decentraland.org/v2/collections/community_contest/wearables/cw_bell_attendant_hat'
  )
})
