import expect from 'expect'
import { LandUtils } from '../src'

function testValidPositionParsingAndGeneration(tokenId: string, x: number, y: number) {
  it(tokenId + ' (' + x + ', ' + y + ') decode', async () => {
    const decodedTokenId = LandUtils.decodeTokenId(tokenId)
    expect({
      x: BigInt(x),
      y: BigInt(y)
    }).toEqual({
      ...decodedTokenId
    })
  })
  it(tokenId + ' (' + x + ', ' + y + ') encode', async () => {
    expect({
      tokenId: BigInt(tokenId)
    }).toEqual({
      tokenId: LandUtils.encodeTokenId(x, y)
    })
  })
}

describe('Land token encoding/decoding', function () {
  testValidPositionParsingAndGeneration('0x0', 0, 0)
  testValidPositionParsingAndGeneration(
    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    -1,
    -1
  )
  testValidPositionParsingAndGeneration('340282366920938463463374607431768211457', 1, 1)
  testValidPositionParsingAndGeneration('680564733841876926926749214863536422912', 2, 0)
  testValidPositionParsingAndGeneration('0x200000000000000000000000000000000', 2, 0)
  testValidPositionParsingAndGeneration('12250165209153784684681485867543655612403', 35, -13)
  testValidPositionParsingAndGeneration('680564733841876926926749214863536422877', 1, -35)
  testValidPositionParsingAndGeneration('4763953136893138488487244504044754960247', 13, -137)
  testValidPositionParsingAndGeneration(
    '115792089237316195423570985008687907802567911994420732983414767500579666132842',
    -150,
    -150
  )
  testValidPositionParsingAndGeneration(
    '115792089237316195423570985008687907802227629627499794519951392893147897921686',
    -150,
    150
  )
  testValidPositionParsingAndGeneration(
    '115792089237316195423570985008687907802908194361341671446878142108011434344299',
    -149,
    -149
  )
  testValidPositionParsingAndGeneration('51042355038140769519506191114765231718550', 150, 150)
})
