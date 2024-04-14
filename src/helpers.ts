import contracts from './contracts'
import rawCollectionsV1 from './collections-v1'

export type Collection = { collectionId: string; contractAddress: string }
/**
 * Map collection-name to contractAddress
 */
const collections: Collection[] = []

const lowerCasedContracts: Record<string, Record<string, string>> = {}

const validNetworks = new Set(['ethereum', 'goerli', 'sepolia', 'matic', 'mumbai', 'amoy'])

for (const network in contracts) {
  lowerCasedContracts[network] = Object.create(null)
  const c = lowerCasedContracts[network]
  if (network.toLowerCase() !== 'mainnet') {
    validNetworks.add(network.toLowerCase())
  }
  Object.keys(contracts[network]).forEach((key) => {
    c[key.toLowerCase()] = contracts[network][key]
  })
}

rawCollectionsV1.forEach((collection) => {
  collections.push({
    contractAddress: collection.id,
    collectionId: collection.name.replace(/^dcl:\/\//, '')
  })
})

export async function getCollection(addressOrName: string): Promise<Collection | null> {
  const sanitizedAddress = addressOrName.toLowerCase()

  for (const collection of collections) {
    if (collection.contractAddress === sanitizedAddress || collection.collectionId === addressOrName) return collection
  }

  return null
}

function mapContract(network: string, contractNameOrAddress: string): string | null {
  if (network === 'ethereum') return mapContract('mainnet', contractNameOrAddress)

  if (lowerCasedContracts[network]) {
    if (contractNameOrAddress in lowerCasedContracts[network]) {
      return lowerCasedContracts[network][contractNameOrAddress]
    }
  } else {
    console.log('network', network, Object.keys(lowerCasedContracts))
  }

  return null
}

export async function getContract(network: string, contractNameOrAddress: string) {
  if (contractNameOrAddress.startsWith('0x')) return contractNameOrAddress
  return mapContract(network.toLowerCase(), contractNameOrAddress.toLowerCase())
}

export function isValidNetwork(protocol: string): boolean {
  return validNetworks.has(protocol.toLowerCase())
}

export type ParserFunction = (original: URL, captures: RegExpExecArray) => Promise<{ url: URL } | undefined>

/** @public */
export type RouteMap<T> = {
  [P in string]: (original: URL, captures: Record<string, string>) => Promise<T | null | void>
}

/**
 * @public
 */
export function createParser<T>(handlers: RouteMap<T>): (urn: string) => Promise<T | null> {
  return async (urn: string) => {
    const url = new URL(urn)

    if (url.protocol !== 'urn:') return null

    for (const expression in handlers) {
      const expr = expression.replace(
        /(?:{([a-zA-Z_][a-zA-Z_0-9]*)(\([^}]+\))?})/g,
        function (substring, name, _matcher) {
          const matcher = _matcher || '[^:]+'
          return `(?<${name}>${matcher})`
        }
      )

      const regex = new RegExp('^' + expr + '$')
      const res = regex.exec(url.pathname)

      if (res) {
        const groups: Record<string, string> = Object.create(null)
        if (res.groups) {
          for (const key in res.groups) {
            groups[key] = decodeURIComponent(res.groups[key])
          }
        }
        const match = await handlers[expression](url, groups)
        if (match) return match as any
      }
    }
    return null
  }
}
