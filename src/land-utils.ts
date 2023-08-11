/* eslint-disable @typescript-eslint/no-namespace */
/**
 * @public
 */
export namespace LandUtils {
  // TODO: use BigNumber.js

  function B(number: string | number | bigint) {
    return BigInt(number)
  }
  type BN = ReturnType<typeof B>

  function requireBounds(x: string | number | bigint, y: string | number | bigint) {
    if (!(B(-1000000) < B(x) && B(x) < B(1000000) && B(-1000000) < B(y) && B(y) < B(1000000)))
      throw new Error(`The coordinates ${x.toString(16)},${y.toString(16)} should be inside bounds`)
  }

  //
  // LAND Getters
  //

  const clearLow = B('0xffffffffffffffffffffffffffffffff00000000000000000000000000000000')
  const clearHigh = B('0x00000000000000000000000000000000ffffffffffffffffffffffffffffffff')
  const factor = B('0x100000000000000000000000000000000')

  /**
   * @public
   */
  export function encodeTokenId(x: number, y: number): BN {
    requireBounds(x, y)
    return ((B(x) * factor) & clearLow) | (B(y) & clearHigh)
  }

  /**
   * @public
   */
  export function decodeTokenId(value: string | number | bigint) {
    return _decodeTokenId(B(value))
  }

  function _unsafeDecodeTokenId(value: BN) {
    return {
      x: expandNegative128BitCast((value & clearLow) >> B(128)),
      y: expandNegative128BitCast(value & clearHigh)
    }
  }

  function _decodeTokenId(value: BN) {
    const { x, y } = _unsafeDecodeTokenId(value)
    requireBounds(x, y)
    return { x, y }
  }

  function expandNegative128BitCast(value: BN) {
    if ((value & B('0x80000000000000000000000000000000' /* 1 << 127 */)) !== B(0)) {
      return B(-((clearLow - value) & clearHigh))
    }
    return B(value)
  }

  /**
   * Converts a string position "-1,5" to \{ x: -1, y: 5 \}
   * @public
   */
  export function parseParcelPosition(position: string) {
    const [x, y] = position
      .trim()
      .split(/\s*,\s*/)
      .map(($) => parseInt($, 10))
    return { x, y }
  }
}
