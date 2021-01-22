import expect from "expect"
import { parseUrn } from "../src/index"

describe("Basic use cases", function () {
  it("test unknown", async () => {
    expect(await parseUrn("urn:test")).toEqual(null)
  })

  it("test land", async () => {
    expect(await parseUrn("urn:decentraland:ethereum:LANDPROXY:0x1")).toMatchObject({
      contract: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
      protocol: "ethereum",
      tokenId: "0x1",
    })
  })

  it("test land (query string)", async () => {
    const t = await parseUrn("urn:decentraland:ethereum:LANDPROXY:0x1?test=1#4")
    expect(t).toHaveProperty("url")
    expect(t.url.toString()).toEqual("urn:decentraland:ethereum:LANDPROXY:0x1?test=1#4")
  })

  it("test land (address)", async () => {
    expect(await parseUrn("urn:decentraland:ethereum:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0x1")).toMatchObject({
      contract: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
      protocol: "ethereum",
      tokenId: "0x1",
    })
  })

  it("portable experiences", async () => {
    expect(await parseUrn("urn:decentraland:off-chain:static-portable-experiences:quest-1")).toMatchObject({
      assetType: "static-portable-experiences",
      name: "quest-1",
      protocol: "off-chain",
    })
  })
})
