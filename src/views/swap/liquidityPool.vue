<template>
  <div class="pool-wrapper">
    <!-- <airDrop /> -->
    <div class="liquidityPool">
      <h2>{{ $t('liquidity.pool.title') }}</h2>
      <div v-if="pairlistloading" class="demo-spin-container">
        <loading />
      </div>

      <template v-if="!isMobile">
        <div v-for="item in dataList" :key="item.pairName" class="poolCon">
          <div class="flex items-center imgWapper">
            <div class="img-wrapper flex">
              <img width="48" :src="getTokenImg(item.pairSymbols[1])">
              <img width="48" :src="getTokenImg(item.pairSymbols[0])" class="otherImg">
            </div>
            <div>
              <p>{{ item.pairName }}</p>
              <span>1 {{ item.configSymbols[0] }} = {{ item.price }} {{ item.configSymbols[1] }}</span>
            </div>
          </div>
          <div class="totalWarpper">
            <span>{{ $t('liquidity.pool.totalInputed') }}</span>
            <p>{{ item.totalSupply | formatBalance }}</p>
          </div>
          <div class="flex items-center inputedWarpper">
            <div class="rightdiv">
              <span>{{ $t('liquidity.pool.inputed') }} {{ item.pairSymbols[0] }}</span>
              <span>{{ $t('liquidity.pool.inputed') }} {{ item.pairSymbols[1] }}</span>
              <!-- <span class="colorText">{{ $t('liquidity.pool.sharePool') }}</span> -->
            </div>
            <div class="number">
              <span>{{ item.aToketotalSupply | formatNormalValue }} {{ item.pairSymbols[0] }}</span>
              <span>{{ item.bToketotalSupply | formatNormalValue }} {{ item.pairSymbols[1] }}</span>
              <!-- <span class="colorText">{{ Calculatepercentage(item.balance,item.totalSupply) |formatRate }}</span> -->
            </div>
          </div>

          <div class="buttonWarpper">
            <template v-if="ethAddress">
              <div class="input-wrapper">
                <button @click="openInput(item)">
                  {{ $t('liquidity.pool.btnInput') }}
                </button>
              </div>
              <div class="remove-wrapper">
                <button @click="openRemove(item)">
                  {{ $t('liquidity.pool.btnRemove') }}
                </button>
              </div>
            </template>

            <template v-else>
              <div class="input-wrapper disableBtn">
                <button>
                  {{ $t('liquidity.pool.btnInput') }}
                </button>
              </div>

              <div class="remove-wrapper disableBtn">
                <button>
                  {{ $t('liquidity.pool.btnRemove') }}
                </button>
              </div>
            </template>
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="(item, index) in dataList" :key="index" class="mobile-list-item">
          <div class="m-img-wrapper">
            <div class="m-img-box">
              <img :src="getTokenImg(item.pairSymbols[1])">
              <img :src="getTokenImg(item.pairSymbols[0])" class="imgRight">
            </div>
          </div>

          <div class="m-price-wrapper">
            <p class="name">
              {{ item.pairName }}
            </p>
            <p class="price">
              1 {{ item.configSymbols[0] }} = {{ item.price }} {{ item.configSymbols[1] }}
            </p>
          </div>

          <div class="m-point-wrapper">
            <div class="point-item">
              <span class="title">{{ $t('liquidity.pool.totalInputed') }}</span>
              <span class="value">
                {{ item.totalSupply | formatBalance }}
              </span>
            </div>
            <div class="point-item">
              <span class="title">{{ $t('liquidity.pool.inputed') }} {{ item.pairSymbols[0] }}</span>
              <span class="value">{{ item.aToketotalSupply | formatNormalValue }} {{ item.pairSymbols[0] }}</span>
            </div>

            <div class="point-item">
              <span class="title">{{ $t('liquidity.pool.inputed') }} {{ item.pairSymbols[1] }}</span>
              <span class="value">{{ item.bToketotalSupply | formatNormalValue }} {{ item.pairSymbols[1] }}</span>
            </div>
          </div>

          <div class="m-btn-wrapper">
            <template v-if="ethAddress">
              <button class="m-btn inputBtn" @click="openInput(item)">
                {{ $t('liquidity.pool.btnInput') }}
              </button>
              <button class="m-btn removeBtn" @click="openRemove(item)">
                {{ $t('liquidity.pool.btnRemove') }}
              </button>
            </template>
            <template v-else>
              <button class="m-btn inputBtn disableBtn">
                {{ $t('liquidity.pool.btnInput') }}
              </button>

              <button class="m-btn removeBtn disableBtn">
                {{ $t('liquidity.pool.btnRemove') }}
              </button>
            </template>
          </div>
        </div>
      </template>
    </div>

    <div class="modal-wrapper">
      <inputDialog ref="input" />
      <removeDialog ref="remove" />
    </div>
  </div>
</template>

<script>
import { readpairLiquidity } from '@/contactLogic/readpairpool.js';
import { mapState } from 'vuex';
const debounce = require('debounce');

const BigNumber = require('bignumber.js');
import event from '@/common/js/event';

import { getTokenImg } from '@/contactLogic/readbalance.js';

export default {
  data() {
    return {
      dataList: [],
      pairlistloading: false,
    };
  },
  components: {
    inputDialog: () => import('./dialog/inputDialog.vue'),
    removeDialog: () => import('./dialog/removeDialog.vue'),
    loading: () => import('@/components/basic/loading.vue'),
    airDrop: () => import('@/components/airDrop.vue'),
    Buttons: () => import('@/components/basic/buttons.vue'),
  },
  mounted() {
    //txsuccess
    console.log('- -');
    event.$on('txsuccess', () => {
      this.readList();
    });
    if (this.ethChainID) {
      this.$data.pairlistloading = true;
      this.readList();
    }
  },
  watch: {
    ethChainID: function () {
      if (this.ethChainID) {
        this.$data.pairlistloading = true;
        this.readList();
      }
    },
    ethAddress: function () {
      if (this.ethAddress) {
        this.$data.pairlistloading = true;
        this.readList();
      }
    },
  },
  methods: {
    tobuilder() {
      this.$router.push('/buildr');
    },
    toexchange() {
      this.$router.push('/exchange');
    },
    getTokenImg(tokensymbol) {
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol, chainID);
    },
    Calculatepercentage(balance, totalSupply) {
      const balance_ = new BigNumber(balance);
      const totalSupply_ = new BigNumber(totalSupply);
      return balance_.div(totalSupply_).toString();
    },
    openInput(pairs) {
      this.$refs.input.open(pairs);
    },
    openRemove(pairs) {
      this.$refs.remove.open(pairs);
    },
    readList: debounce(async function () {
      console.log('readList');
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      try {
        const list = await readpairLiquidity(chainID, library, account);
        list.forEach((element) => {
          element.aToketotalSupply = element.aToketotalSupply.toSignificant(6);
          element.bToketotalSupply = element.bToketotalSupply.toSignificant(6);
        });

        console.log(list);
        this.$data.dataList = list;
      } catch (error) {
        console.log(error);
      } finally {
        this.$data.pairlistloading = false;
      }
    }, 1000),
  },
  computed: {
    ...mapState(['ethChainID', 'ethAddress', 'web3', 'ethersprovider', 'isMobile']),
  },
};
</script>

<style lang="less" scoped>
@import './media/index.less';
.pool-wrapper {
  .rewards-wrapper {
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    h2 {
      height: 40px;
      font-size: 32px;
      font-family: Gilroy-Bold, Gilroy;
      font-weight: bold;
      line-height: 38px;
      background: linear-gradient(90deg, #fc466b 0%, #3f5efb 30%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      height: 19px;
      font-size: 16px;
      line-height: 19px;
      margin: 8px 0 16px;
    }
  }
  .liquidityPool {
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    h2 {
      height: 24px;
      font-size: 20px;
      line-height: 24px;
      margin-bottom: 24px;
    }
    p {
      height: 19px;
      font-size: 16px;
      font-weight: 400;
      color: #14171c;
      line-height: 19px;
    }
    .poolCon {
      display: flex;
      margin-top: 24px;
      padding: 22px 24px;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
      border-radius: 12px;
      div {
        p {
          height: 24px;
          font-size: 20px;
          line-height: 24px;
        }
        span {
          display: block;
          height: 16px;
          font-size: 14px;
          color: #828489;
          line-height: 16px;
          margin-bottom: 6px;
        }
        .img-wrapper {
          margin-right: 16px;
          width: 72px;
          height: 48px;
          position: relative;
          img {
            position: absolute;
            left: 0;
            bottom: 0;
          }
          .otherImg {
            left: 24px;
          }
        }
        .input-wrapper {
          // width: 160px;
          height: 36px;
          background: #ff41a1;
          border-radius: 18px;
          button {
            width: 100%;
            height: 100%;
            font-size: 16px;
            color: #ffffff;
            line-height: 19px;
          }
        }
        .remove-wrapper {
          // width: 160px;
          height: 36px;
          border-radius: 18px;
          border: 1px solid #ff41a1;
          margin-top: 8px;
          button {
            width: 100%;
            height: 100%;
            font-size: 16px;
            color: #ff41a1;
            line-height: 19px;
          }
        }
        .colorText {
          font-size: 14px;
          color: #828489;
          line-height: 16px;
          background: linear-gradient(90deg, #fc466b 0%, #3f5efb 80%);
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .number {
        margin-left: 80px;
        span {
          color: #14171c;
        }
      }
      .imgWapper {
        width: 25%;
      }
      .totalWarpper {
        width: 15%;
      }
      .inputedWarpper {
        width: 25%;
        white-space: nowrap;
      }
      .buttonWarpper {
        width: 15%;
        margin-top: 12px;
      }
    }
  }
}
.demo-spin-container {
  display: inline-block;
  width: 100%;
  height: 200px;
  position: relative;
  margin-top: 100px;
}
</style>