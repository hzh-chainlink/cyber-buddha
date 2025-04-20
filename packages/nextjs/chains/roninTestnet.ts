import { defineChain } from "viem";

export const ronin = /*#__PURE__*/ defineChain({
  id: 2021,
  name: 'Ronin Saigon Testnet',
  nativeCurrency: { name: 'RON', symbol: 'RON', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://saigon-testnet.roninchain.com/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ronin Saigon Explorer',
      url: 'https://saigon-app.roninchain.com/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 18736871,
    },
  },
})
