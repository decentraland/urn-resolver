import expect from "expect"
import { DecentralandAssetIdentifier, parseUrn } from "../src/index"

let counter = 0

function testValidUrnToInclude(urn: string, toInclude: Partial<DecentralandAssetIdentifier>) {
  it(urn + " (" + ++counter + ")", async () => {
    expect(await parseUrn(urn)).toMatchObject(toInclude)
  })
}



describe("Basic use cases", function () {
  it("test unknown", async () => {
    expect(await parseUrn("urn:test")).toEqual(null)
  })

  it("Print LAND resolution for readme", async () => {
    console.log(await parseUrn("urn:decentraland:ropsten:LAND:-10,-13?atBlock=151231111"))
  })

  it("test land", async () => {
    expect(await parseUrn("urn:decentraland:ethereum:LANDPROXY:0x1")).toMatchObject({
      contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
      network: "mainnet",
      blockchain: "ethereum",
      type: "blockchain-asset",
      id: "0x1",
    })
  })

  it("test land (query string)", async () => {
    const t = await parseUrn("urn:decentraland:ethereum:LANDPROXY:0x1?test=1#4")
    expect(t).toHaveProperty("uri")
    expect(t.uri.toString()).toEqual("urn:decentraland:ethereum:LANDPROXY:0x1?test=1#4")
  })

  it("test land (address)", async () => {
    expect(await parseUrn("urn:decentraland:ethereum:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0x1")).toMatchObject({
      contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
      type: "blockchain-asset",
      network: "mainnet",
      id: "0x1",
    })
  })

  it("test land (ropsten)", async () => {
    expect(await parseUrn("urn:decentraland:ropsten:landregistry:0x1")).toMatchObject({
      contractAddress: "0x255baf4096cb1723c00c4b4390a4b3028ecaa8ba",
      blockchain: "ethereum",
      network: "ropsten",
      id: "0x1",
    })
  })

  it("test land (ropsten) upper case", async () => {
    expect(await parseUrn("urn:decentraland:ROPSTEN:LandRegistry:0x1")).toMatchObject({
      contractAddress: "0x255baf4096cb1723c00c4b4390a4b3028ecaa8ba",
      blockchain: "ethereum",
      network: "ropsten",
      id: "0x1",
    })
  })

  it("portable experiences", async () => {
    expect(await parseUrn("urn:decentraland:off-chain:static-portable-experiences:quest-1")).toMatchObject({
      id: "quest-1",
      registry: "static-portable-experiences",
      type: "off-chain",
    })
  })

  it("test collection v1", async () => {
    const r = await parseUrn(
      "urn:decentraland:ethereum:collections:v1:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:test_name"
    )
    expect(r).toMatchObject({
      type: "blockchain-collection-v1",
      blockchain: "ethereum",
      network: "mainnet",
      collectionsVersion: "v1",
      contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
      id: "test_name",
    })
  })

  it("test collection v2 (invalid id)", async () => {
    const r = await parseUrn(
      "urn:decentraland:ethereum:collections:v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:test_name"
    )
    expect(r).toBeNull()
  })

  it("test collection v2", async () => {
    const r = await parseUrn("urn:decentraland:ethereum:collections:v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0")
    expect(r).toMatchObject({
      blockchain: "ethereum",
      type: "blockchain-collection-v2",
      network: "mainnet",
      collectionsVersion: "v2",
      contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
      id: "0",
    })
  })
  testValidUrnToInclude("urn:decentraland:ethereum:collections:v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0", {
    id: "0",
  })
  testValidUrnToInclude("urn:decentraland:ethereum:collections:v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0x1", {
    id: "0x1",
  })
  testValidUrnToInclude("urn:decentraland:ethereum:collections:v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0x0", {
    id: "0x0",
  })
  testValidUrnToInclude(
    "urn:decentraland:ethereum:collections:v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:123456789",
    {}
  )
  testValidUrnToInclude(
    "urn:decentraland:ethereum:collections:v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0x000011111111111abcdef9087654321",
    {}
  )

  testValidUrnToInclude("urn:decentraland:ethereum:LAND:0,0", {
    contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
    id: "0x0",
  })

  testValidUrnToInclude(`urn:decentraland:ethereum:LAND:${encodeURIComponent("0,0")}`, {
    contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
    id: "0x0",
    x: 0,
    y: 0,
  })

  testValidUrnToInclude("urn:decentraland:ethereum:LAND:13,-137", {
    contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
    id: "0xdffffffffffffffffffffffffffffff77",
    x: 13,
    y: -137,
  })

  testValidUrnToInclude("urn:decentraland:ethereum:LAND:0xdffffffffffffffffffffffffffffff77", {
    contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
    id: "0xdffffffffffffffffffffffffffffff77",
    x: 13,
    y: -137,
  })

  testValidUrnToInclude("urn:decentraland:ethereum:LAND:4763953136893138488487244504044754960247", {
    contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
    id: "0xdffffffffffffffffffffffffffffff77",
    x: 13,
    y: -137,
  })

  testValidUrnToInclude("urn:decentraland:ethereum:collections:v1:community_contest:cw_bell_attendant_hat", {
    contractAddress: "0x32b7495895264ac9d0b12d32afd435453458b1c6",
    collectionName: "community_contest",
    id: "cw_bell_attendant_hat",
  })

  testValidUrnToInclude(
    "urn:decentraland:ethereum:collections:v1:0x32b7495895264ac9d0b12d32afd435453458b1c6:cw_bell_attendant_hat",
    {
      contractAddress: "0x32b7495895264ac9d0b12d32afd435453458b1c6",
      collectionName: "community_contest",
      id: "cw_bell_attendant_hat",
    }
  )

  testValidUrnToInclude("urn:decentraland:ethereum:collections:v1:InExIsTeNtCoLlEcTiOn19283719:maddona-modern-life", {
    contractAddress: null,
    collectionName: "InExIsTeNtCoLlEcTiOn19283719",
    id: "maddona-modern-life",
  })
})
