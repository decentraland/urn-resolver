import contracts from "./contracts"

const lowerCasedContracts: Record<string, Record<string, string>> = {}

const validProtocols = new Set(["ethereum", "ropsten", "kovan", "rinkeby", "goerli", "matic", "mumbai"])

for (let network in contracts) {
  lowerCasedContracts[network] = Object.create(null)
  const c = lowerCasedContracts[network]
  if (network.toLowerCase() != "mainnet") {
    validProtocols.add(network.toLowerCase())
  }
  Object.keys(contracts[network]).forEach((key) => {
    c[key.toLowerCase()] = contracts[network][key]
  })
}

function mapContract(network: string, contractNameOrAddress: string): string | null {
  if (network == "ethereum") return mapContract("mainnet", contractNameOrAddress)

  if (lowerCasedContracts[network]) {
    if (contractNameOrAddress in lowerCasedContracts[network]) {
      return lowerCasedContracts[network][contractNameOrAddress]
    }
  } else {
    console.log("network", network, Object.keys(lowerCasedContracts))
  }

  return null
}

function getContract(network: string, contractNameOrAddress: string) {
  if (contractNameOrAddress.startsWith("0x")) return contractNameOrAddress
  return mapContract(network.toLowerCase(), contractNameOrAddress.toLowerCase())
}

type ParserFunction = (original: URL, captures: RegExpExecArray) => Promise<{ url: URL } | undefined>

const routes: Record<string, ParserFunction> = {
  "decentraland:(?<protocol>[^:]+):(?<ens>[^:]+).eth:(?<tokenId>[^:]+)": async (url, captures) => {
    const groups: Record<"protocol" | "ens" | "tokenId", string> = captures.groups as any

    if (!validProtocols.has(groups.protocol.toLowerCase())) return
    // TODO: resolve ens

    return {
      url,
      protocol: groups.protocol,
      contract: groups.ens + ".ens",
      ens: groups.ens + ".ens",
      tokenId: groups.tokenId,
    }
  },
  "decentraland:(?<protocol>[^:]+):(?<contract>[^:]+):(?<tokenId>[^:]+)": async (url, captures) => {
    const groups: Record<"protocol" | "contract" | "tokenId", string> = captures.groups as any

    if (!validProtocols.has(groups.protocol.toLowerCase())) return

    const contract = getContract(groups.protocol, groups.contract)

    if (contract)
      return {
        url,
        protocol: groups.protocol,
        contract: contract,
        tokenId: groups.tokenId,
      }
  },
}

/**
 * @public
 */
export async function parseUrn<T extends { url: URL } = { url: URL }>(urn: string): Promise<T | null> {
  const url = new URL(urn)

  for (let expression in routes) {
    const regex = new RegExp(expression)
    const res = regex.exec(url.pathname)

    if (res) {
      const match = await routes[expression](url, res)
      if (match) return match as any
    }
  }
  return null
}
