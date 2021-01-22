import expect from "expect"
import { resolveUrn } from "../src/index"

describe("Basic use cases", function () {
  it("test unknown", async () => {
    expect(await resolveUrn("urn:test")).toEqual(null)
  })

  it("test land", async () => {
    expect(await resolveUrn("urn:decentraland:ethereum:LANDPROXY:0x1")).toMatchObject({
      contract: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
      ethereum: "ethereum",
      tokenId: "0x1",
    })
  })

  it("test land (query string)", async () => {
    const t = await resolveUrn("urn:decentraland:ethereum:LANDPROXY:0x1?test=1#4")
    expect(t).toHaveProperty("url")
    expect(t.url.toString()).toEqual("urn:decentraland:ethereum:LANDPROXY:0x1?test=1#4")
  })

  it("test land (address)", async () => {
    expect(await resolveUrn("urn:decentraland:ethereum:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0x1")).toMatchObject({
      contract: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
      ethereum: "ethereum",
      tokenId: "0x1",
    })
  })
})
