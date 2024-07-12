import { RFC2141 } from 'urn-lib'
import { ResolversOptions, resolveUrlFromUrn } from '../src'

describe('Tests for resolveUrlFromUrn function', function () {
  describe('without passing resolver options', () => {
    const cases: [string, string | null][] = [
      ['decentraland:off-chain:something:something-else', null],
      [
        'urn:decentraland:off-chain:static-portable-experiences:quest-1',
        'https://static-pe.decentraland.io/quest-1/mappings'
      ],
      [
        'urn:decentraland:off-chain:unity-renderer-cdn:0.0.0-123123123-badaeafa',
        'https://cdn.decentraland.org/@dcl/unity-renderer/0.0.0-123123123-badaeafa'
      ],
      [
        'urn:decentraland:off-chain:kernel-cdn:0.0.0-123123123-badaeafa',
        'https://cdn.decentraland.org/@dcl/kernel/0.0.0-123123123-badaeafa'
      ],
      [
        'urn:decentraland:entity:bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki?baseUrl=https://ipfs.com/ipfs',
        'https://ipfs.com/ipfs/bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki'
      ],
      // ADR-207
      [
        'urn:decentraland:entity:bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki?=dcl&baseUrl=https://ipfs.com/ipfs',
        'https://ipfs.com/ipfs/bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki'
      ],
      [
        'urn:decentraland:entity:bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki?=&baseUrl=https://ipfs.com/ipfs',
        'https://ipfs.com/ipfs/bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki'
      ],
      [
        'urn:decentraland:entity:bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki?baseUrl=https://ipfs.com/ipfs',
        'https://ipfs.com/ipfs/bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki'
      ],
      [
        'urn:decentraland:entity:bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki?baseUrl=https://ipfs.com/ipfs/',
        'https://ipfs.com/ipfs/bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki'
      ],
      [
        'urn:decentraland:entity:bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki',
        'https://peer.decentraland.org/content/contents/bafkreickvfk6aungjshpuuwyhkopd4hlzsyqewhx4jru3gpp46whek7dki'
      ],
      [
        'urn:decentraland:off-chain:dcl-cdn:@dcl/kernel/0.0.0-123123123-badaeafa',
        'https://cdn.decentraland.org/@dcl/kernel/0.0.0-123123123-badaeafa'
      ],
      [
        'urn:decentraland:off-chain:explorer-website-cdn:0.0.0-123123123-badaeafa',
        'https://cdn.decentraland.org/@dcl/explorer-website/0.0.0-123123123-badaeafa'
      ],
      [
        'urn:decentraland:ethereum:LAND:4763953136893138488487244504044754960247',
        'https://peer.decentraland.org/content/entities/scene?pointer=13,-137'
      ],
      [
        'urn:decentraland:sepolia:LAND:4763953136893138488487244504044754960247',
        'https://peer.decentraland.zone/content/entities/scene?pointer=13,-137'
      ],
      [
        'urn:decentraland:sepolia:LAND:-10,-13',
        'https://peer.decentraland.zone/content/entities/scene?pointer=-10,-13'
      ],
      [
        'urn:decentraland:ethereum:collections-v1:community_contest:cw_bell_attendant_hat',
        'https://wearable-api.decentraland.org/v2/collections/community_contest/wearables/cw_bell_attendant_hat'
      ],
      ['urn:decentraland:ethereum:collections-v1:base-avatars:eyes_03', null],
      [
        'urn:decentraland:off-chain:base-avatars:eyes_03',
        'https://wearable-api.decentraland.org/v2/collections/base-avatars/wearables/eyes_03'
      ],
      [
        'dcl://base-avatars/eyes_03',
        'https://wearable-api.decentraland.org/v2/collections/base-avatars/wearables/eyes_03'
      ],
      [
        'urn:decentraland:ethereum:collections-v1:0x32b7495895264ac9d0b12d32afd435453458b1c6:cw_bell_attendant_hat',
        'https://wearable-api.decentraland.org/v2/collections/community_contest/wearables/cw_bell_attendant_hat'
      ],
      [
        'dcl://halloween_2019/bride_of_frankie_earring',
        'https://wearable-api.decentraland.org/v2/collections/halloween_2019/wearables/bride_of_frankie_earring'
      ]
    ]

    test.each(cases)('%s', async (urn: string, expected: string, options: ResolversOptions = {}) => {
      expect(RFC2141.parse(urn)).toBeTruthy()
      expect(await resolveUrlFromUrn(urn, options)).toEqual(expected)
    })
  })

  describe('with resolver options', () => {
    const casesWithResolverOptions: [string, string, ResolversOptions][] = [
      [
        'urn:decentraland:sepolia:LAND:4763953136893138488487244504044754960247',
        'https://localhost:7666/content/entities/scene?pointer=13,-137',
        { contentServerHost: 'localhost:7666' }
      ]
    ]

    test.each(casesWithResolverOptions)('%s', async (urn: string, expected: string, options: ResolversOptions) => {
      expect(RFC2141.parse(urn)).toBeTruthy()
      expect(await resolveUrlFromUrn(urn, options)).toEqual(expected)
    })
  })
})
