<template>
  <header class="header-wrapper header-wrapper-bg">
    <nav class="nav-wrapper container mx-auto flex justify-between items-center">
      <div class="left-wrapper flex items-center">
        <img width="150" src="../../assets/img/home/1.png" alt="logo">
        <div class="menu-wrapper">
          <router-link class="menu-item" to="/exchange" active-class="active">
            {{ $t('header.nav.Exchange') }}
          </router-link>
          <router-link class="menu-item" to="/earn" active-class="active">
            {{ $t('header.nav.Earn') }}
          </router-link>
          <a href="https://bridge.lambdastorage.com/" class="menu-item" target="_blank">{{ $t('header.nav.Bridge') }}</a>
          <a href="https://lamb-swap.gitbook.io/lambswap/" class="menu-item" target="_blank">{{ $t('header.nav.Docs') }}</a>
          <a href="https://info.lambswap.fi/pair/0x3ef407f05ca26a641e3a3d40b4ca0e7622676e1a" class="menu-item" target="_blank">{{ $t('header.nav.chart') }}</a>
        </div>
      </div>

      <Dropdown v-if="ethChainID" trigger="click" class="AddLambwallet-wrapper" @on-click="addtoken">
        <div class="AddLambwallet flex items-center">
          <div class="dot" />
          <span>{{ $t('header.AddLambwallet') }}</span>
          <img class="arrow" src="../../assets/img/down.svg" alt="down">
        </div>
        <DropdownMenu slot="list" class="list-wrapper">
          <template v-for="(item, index) in tokenList">
            <DropdownItem :key="index" class="list-item" :name="index">
              <img :src="item.imgSrc">
              <span>{{ item.name }}</span>
            </DropdownItem>
          </template>
        </DropdownMenu>
      </Dropdown>
      <div class="connect-wrapper flex justify-between items-center">
        <Dropdown trigger="click" class="network-wrapper" @on-click="choseNetWork">
          <div class="netWork flex justify-between items-center" :class="getBg">
            <div class="dot" :class="statusVal" />
            <span>{{ network }}</span>
            <img class="arrow" src="../../assets/img/down.svg" alt="down">
          </div>
          <DropdownMenu slot="list" class="list-wrapper">
            <template v-for="(item, index) in getNetList">
              <DropdownItem v-if="netInfo[item].isBan === false" :key="index" class="list-item" :name="item">
                <img :src="netInfo[item].imgSrc" :alt="item">
                <span>{{ netInfo[item].name }}</span>
              </DropdownItem>
              <DropdownItem v-else :key="index" disabled class="list-item" :name="item">
                <img :src="netInfo[item].imgSrc" :alt="item">
                <span>{{ netInfo[item].name }}</span>
              </DropdownItem>
            </template>
          </DropdownMenu>
        </Dropdown>

        <button v-if="!ethAddress" class="connectBtn" @click="openWalletDialog">
          {{ $t('header.connectWallet') }}
        </button>

        <template v-else>
          <Dropdown trigger="click" class="func-wrapper" @on-click="choseFunc">
            <div class="connected-content flex justify-start items-center">
              <img src="../../assets/img/metamask18.svg" alt="metamask">
              <span>{{ getShortAddress }}</span>
              <img class="arrow" src="../../assets/img/down.svg" alt="down">
            </div>
            <DropdownMenu slot="list" class="func-list-wrapper">
              <DropdownItem class="list-item" name="copy">
                <img src="../../assets/img/copy16.svg" alt="copy">
                <span>{{ $t('header.copyAddress') }}</span>
              </DropdownItem>
              <DropdownItem class="list-item" name="change">
                <img src="../../assets/img/changeWallet.svg" alt="change">
                <span>{{ $t('header.changeWallet') }}</span>
              </DropdownItem>
              <!-- <DropdownItem class="list-item" name="disconnect">
                <img src="../../assets/img/disconnect16.svg" alt="disconnect">
                <span>{{ $t('header.Disconnect') }}</span>
              </DropdownItem> -->
            </DropdownMenu>
          </Dropdown>
        </template>
        </button>
      </div>
    </nav>
    <walletdialog ref="wallet" />
  </header>
</template>

<script>
import { mapState } from 'vuex';
import config from '@/config/config.js';
import jscookie from 'js-cookie';
import {  getToken} from '@/contactLogic/readbalance.js';

export default {
  components: {
    walletdialog: () => import('./dialog/walletDialog'),
  },
  data() {
    return {
      isExchange: false,
      showBoxShadow: false,
      network: '',
      netInfo: config.netInfo,
      netID: '1',
      statusVal: '',
      tokenList:[{
        isBan:true,
        imgSrc:'https://www.lambswap.fi/tokenlogo/lamb48.svg',
        name:'LAMB'
      },{
        isBan:true,
        imgSrc:'https://www.lambswap.fi/tokenlogo/usdt48.svg',
        name:'USDT'
      },{
        isBan:true,
        imgSrc:'https://www.lambswap.fi/tokenlogo/fil.png',
        name:'FIL'
      },{
        isBan:true,
        imgSrc:'https://www.lambswap.fi/tokenlogo/eth48.svg',
        name:'ETH'
      },{
        isBan:true,
        imgSrc:'https://www.lambswap.fi/tokenlogo/goat.jpg',
        name:'GOAT'
      }]
    };
  },
  methods: {
   async addtoken(index){
      const item = this.$data.tokenList[index];

      const chainID = this.ethChainID;
      const TokenA = getToken(item.name, chainID);
      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address: TokenA.address, // The address that the token is at.
              symbol: TokenA.symbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: TokenA.decimals, // The number of decimals in the token
              image: item.imgSrc, // A string url of the token logo
            },
          },
        });

        if (wasAdded) {
          console.log('Thanks for your interest!');
        } else {
          console.log('Your loss!');
        }
      } catch (error) {
        console.log(error);
      }

    },
    openWalletDialog() {
      this.$refs.wallet.open();
    },
    copyAddress() {
      this.$copyText(this.ethAddress).then(() => {
        this.$Notice.success({
          title: this.$t('notice.n36'),
        });
      });
    },
    // 选择目标网络
    choseNetWork(val) {
      this.netID = val;
      jscookie.set('targetNet', val, { expires: 180 });
      this.getStatus();

      this.network = this.netInfo[val].name;
      jscookie.set('net', this.network, { expires: 180 });
    },

    async choseFunc(val) {
      if (val === 'copy') {
        this.copyAddress();
      }
      if (val === 'change') {
        this.openWalletDialog();
      }
      // if (val === 'disconnect') {
      //   this.disconnectWallet();
      // }
    },

    // async disconnectWallet() {
    //   console.log('disconnect');
    // },

    getStatus() {
      const targetID = parseInt(jscookie.get('targetNet')) || 128;

      this.network = jscookie.get('net');
      if(!this.network) {
        this.network = this.netInfo[config.defaultChainID].name;
      }

      // console.log(targetID, this.ethChainID, this.network);
      if (!this.ethAddress) {
        this.statusVal = 'notConnect';
        this.$Notice.warning({
          title: this.$t('notice.n37'),
          desc: this.$t('notice.n38'),
        });
      }
      if (this.ethAddress && targetID !== this.ethChainID) {
        this.statusVal = 'wrongConnect';
        this.$Notice.error({
          title: this.$t('notice.n39'),
          desc: this.$t('notice.n40'),
          duration: 30
        });
      }

      if (this.ethAddress && targetID === this.ethChainID) {
        this.statusVal = 'connect';
        this.$Notice.success({
          title: this.$t('notice.n41'),
          desc: this.ethAddress,
        });
      }
      // console.log(this.statusVal);
    },
  },
  computed: {
    ...mapState(['ethAddress', 'ethChainID']),
    getShortAddress() {
      return `${this.ethAddress.slice(0, 6)}...${this.ethAddress.slice(-6)}`;
    },
    getNetList() {
      const list = Object.keys(this.netInfo);
      return list;
    },
    getBg() {
      let styleVal;
      switch (this.netID) {
        case '1':
          styleVal = 'ethNet';
          break;
        case '3':
          styleVal = 'ethNet';
          break;
        case '128':
          styleVal = 'hecoNet';
          break;
        case '256':
          styleVal = 'hecoNet';
          break;
        case '56':
          styleVal = 'bscNet';
          break;
        case '97':
          styleVal = 'bscNet';
          break;

        default:
          styleVal = 'ethNet';
          break;
      }
      return styleVal;
    },
    isReady() {
      return this.ethChainID && this.ethAddress;
    },
  },
  watch: {
    isReady(value) {
      if (value) {
        this.getStatus();
      }
    },
  },
  mounted() {
    if (this.isReady) {
      this.getStatus();
    } else {
      this.statusVal = 'notConnect';
      // 设置默认网络
      this.network = this.netInfo[config.defaultChainID].name;
    }
  },
};
</script>

<style lang="less" scoped>
.header-wrapper {
  width: 100%;
  height: 88px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: #ffffff;
  .nav-wrapper {
    height: 100%;
    .left-wrapper {
      width: 58%;
      height: 100%;
      .menu-wrapper {
        margin-left: 50px;
        .menu-item {
          display: inline-block;
          text-align: center;
          padding: 0px 16px;
          height: 28px;
          font-size: 16px;
          font-weight: 500;
          color: #14171c;
        }
        .active {
          display: inline-block;
          height: 28px;
          text-align: center;
          background: #FF41A1;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          line-height: 28px;
        }
      }
    }
    .AddLambwallet-wrapper{
      cursor: pointer;
        .AddLambwallet{
          span {
            font-size: 14px;
            font-weight: 500;
            color: #14171c;
            line-height: 16px;
          }
          img {
            margin: 0px 8px;
          }
        }
      }

    .connect-wrapper {
      .connected-content {
        img {
          max-width: 14px;
          margin-right: 8px;
        }
        span {
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          color: #14171c;
          line-height: 14px;
          margin-right: 8px;
        }
        .changeBtn {
          width: 148px;
          height: 40px;
          border: 1px solid #FF41A1;
          font-size: 16px;
          font-weight: 500;
          color: #14171c;
          line-height: 19px;
        }
      }
      .network-wrapper {
        cursor: pointer;
        width: 124px;
        margin-right: 20px;
        .netWork {
          width: 124px;
          height: 28px;
          // background: rgba(54, 74, 111, 0.1);
          border-radius: 14px;
          .dot {
            margin-left: 8px;
            width: 8px;
            height: 8px;
            // background: #00d075;
            border-radius: 100%;
          }
          span {
            font-size: 14px;
            font-weight: 500;
            color: #14171c;
            line-height: 16px;
          }
          .arrow {
            margin-right: 8px;
          }
        }
      }

    }
  }
}
.header-wrapper-bg {
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.06);
}
.list-item {
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.06);
  img {
    max-width: 16px;
    margin-right: 8px;
  }
  span {
    font-size: 14px;
    font-weight: 500;
    color: #14171c;
    line-height: 16px;
  }
}
.ethNet {
  background: rgba(54, 74, 111, 0.1);
  border: 1px solid #364a6f;
}
.hecoNet {
  background: rgba(0, 172, 228, 0.1);
  border: 1px solid #00ace4;
}
.bscNet {
  background: rgba(240, 185, 11, 0.1);
  border: 1px solid #f0b90b;
}
.notConnect {
  background: #bbbbbb;
}
.wrongConnect {
  background: #ff3c00;
}
.connect {
  background: #00d075;
}
.connectBtn {
  width: 148px;
  height: 40px;
  border-radius: 20px;
  line-height: 19px;
  font-size: 16px;
  color: #FF41A1;
  border: 1px solid #FF41A1;
}

.connectBtnadd{
  padding: 0 8px;
  height: 28px;
  border-radius: 10px;
  line-height: 19px;

  color: #FF41A1;
  border: 1px solid #FF41A1;
  border-radius: 14px;
  margin-right: 10px;
}
@media (min-width: 1441px) {
   .left-wrapper {
     min-width: 68%;
      .menu-wrapper {
        margin-left: 60px;
        .menu-item {
          margin-right: 30px;
        }
      }
    }
    .connect-wrapper{
      width: 22%;
    }
}
</style>