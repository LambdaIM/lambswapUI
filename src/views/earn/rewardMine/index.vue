<template>
  <div class="rewardMine-wrapper">
    <div v-if="showLoading">
      <loading />
    </div>
    <template v-else>
      <!-- <airDrop /> -->

      <mlambPool />
      <!-- <singeMineList :data="designatedData" /> -->
      <multiMineList :data="liquidityData" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { StakingRewardListbatch } from '../utils/helpUtils/mineUtilFunc.js';
import event from '@/common/js/event';
import { pairListEarn } from '@/contactLogic/readpairpool.js';
import { getTokenImg } from '@/contactLogic/readbalance.js';
import Web3 from 'web3';
import _ from 'underscore';
import axios from 'axios';
export default {
  data() {
    return {
      designatedData: [],
      liquidityData: [],
      showLoading: false,
    };
  },
  components: {
    singeMineList: () => import('./components/singleMineList.vue'),
    multiMineList: () => import('./components/multiMineList.vue'),
    mlambPool: () => import('./components/mLAMBPool.vue'),
    loading: () => import('@/components/basic/loading.vue'),
    airDrop: () => import('@/components/airDrop.vue'),
  },
  methods: {
    async getListData() {
      this.showLoading = true;
      try {
        const data = await StakingRewardListbatch(this.ethersprovider, this.ethAddress, this.ethChainID);
        const pairListPrice = await pairListEarn(this.ethChainID, this.ethersprovider);
        console.log({ data });
        const tempLiquidity = data.filter((item) => item.kind === 'multi');
        // const lambdata = await axios.get(`http://explorer.lambdastorage.com/api/proxy/pledgeInfo`);
        // console.log({lambdata});
        // console.log({tempLiquidity});
        const result = [];
        const results = async () => {
          for (let index = 0; index < tempLiquidity.length; index++) {
            const item = tempLiquidity[index];
            const res = await this.getPriceData(item, pairListPrice);
            result.push({
              ...item,
              poolValue: res.usdtNum,
              price: res.price,
              img1: res.img1,
              img2: res.img2,
            });
          }
        };
        await results();
        console.log({ result });
        this.liquidityData = result;

        // this.designatedData = data.filter((item) => item.kind === 'single');
      } catch (error) {
        console.log(error);
      } finally {
        this.showLoading = false;
      }
    },
    async getPriceData(item, pairListPrice) {
      console.log('getPriceData');
      const obj = {};
      const tokensymbolA = item.symbol[0];
      const tokensymbolB = item.symbol[1];
      const pledgeBalance = item && item.data && item.data.totalSupply;
      const pledgeBalanceWei = Web3.utils.toWei(pledgeBalance.toString());
      // 匹配读取价格信息
      const pairPriceItem = _.find(pairListPrice, (pairItem) => {
        if (
          (pairItem.pairInfo.tokenAmounts[0].token.symbol == tokensymbolA &&
            pairItem.pairInfo.tokenAmounts[1].token.symbol == tokensymbolB) ||
          (pairItem.pairInfo.tokenAmounts[1].token.symbol == tokensymbolA &&
            pairItem.pairInfo.tokenAmounts[0].token.symbol == tokensymbolB)
        ) {
          return pairItem;
        }
      });
      // 构造价格相关信息
      const data = {
        aTokenbalance: pairPriceItem.aTokenbalance(pledgeBalanceWei),
        bTokenbalance: pairPriceItem.bTokenbalance(pledgeBalanceWei),
        price: pairPriceItem.price(tokensymbolA, tokensymbolB).price,
      };
      if (data.aTokenbalance.token.symbol == tokensymbolA) {
        obj.usdtNum = data.aTokenbalance.multiply(data.price).add(data.bTokenbalance).toSignificant(6);
      } else {
        obj.usdtNum = data.bTokenbalance.multiply(data.price).add(data.aTokenbalance).toSignificant(6);
      }
      obj.price = data.price && data.price.toSignificant(6);
      obj.img1 = getTokenImg(item.symbol[0], this.ethChainID);
      obj.img2 = getTokenImg(item.symbol[1], this.ethChainID);
      if (tokensymbolA === 'GOAT' && tokensymbolB === 'LAMB') {
        this.$store.commit('changeScashPrice', obj.price);
      }
      this.$store.commit('changeEarnPrice', obj.price);
      return obj;
    },
  },
  computed: {
    ...mapState(['ethersprovider', 'ethChainID', 'ethAddress', 'web3', 'earnPrice', 'scashPrice']),
    isReady() {
      return this.ethChainID && this.ethersprovider;
    },
    isConnect() {
      return this.ethAddress;
    },
  },
  watch: {
    isReady(value) {
      if (value) {
        this.getListData();
      }
    },
    isConnect(value) {
      if (value) {
        this.getListData();
      }
    },
  },
  created() {
    if (this.isReady) {
      this.getListData();
    }
  },
  mounted() {
    event.$on('txsuccess', () => {
      this.getListData();
    });
  },
};
</script>

<style lang="less" scoped>
@import './media/media.less';
.rewardMine-wrapper {
  position: relative;
  width: 100%;
  // min-height: 700px;
}
</style>