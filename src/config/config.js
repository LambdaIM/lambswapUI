export default {
  defaultChainID: 128,
  walletconnectRPC:{
    128: "https://http-mainnet-node.huobichain.com",
    256:'https://http-testnet.hecochain.com',
    4:"https://rinkeby.infura.io/v3/0dd2833fd0b9495885ebc1e44323fb82",
    1:"https://rinkeby.infura.io/v3/0dd2833fd0b9495885ebc1e44323fb82"

  },
  netInfo: {
    '1': {
      imgSrc: require('../assets/img/eth48.png'),
      name: 'Ethereum',
      isBan: true
    },
    '3': {
      imgSrc: require('../assets/img/eth48.png'),
      name: 'Ropsten',
      isBan: true
    },
    '4': {
      imgSrc: require('../assets/img/eth48.png'),
      name: 'Rinkeby',
      isBan: true
    },
    '256': {
      imgSrc: require('../assets/img/huobi48.svg'),
      name: 'Heco Test',
      isBan: true
    },
    '128': {
      imgSrc: require('../assets/img/huobi48.svg'),
      name: 'Heco Main',
      isBan: false
    },
    '56': {
      imgSrc: require('../assets/img/binance48.svg'),
      name: 'BSC Main',
      isBan: true
    },
    '97': {
      imgSrc: require('../assets/img/binance48.svg'),
      name: 'BSC Test',
      isBan: true
    },
  },
  defaultReward: 0.08312623156740682
};