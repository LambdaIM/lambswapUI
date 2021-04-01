<template>
  <div class="rewardMine-wrapper">
    <div v-if="showLoading">
      <loading />
    </div>
    <template v-else>
      <airDrop />
      <!-- <singeMineList :data="designatedData" /> -->
      <multiMineList :data="liquidityData" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { StakingRewardListbatch } from '../utils/helpUtils/mineUtilFunc.js';
import event from '@/common/js/event';
import { readpariInfoNuminfoEarn } from '@/contactLogic/readpairpool.js';
import { getTokenImg } from '@/contactLogic/readbalance.js';
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
    loading: () => import('@/components/basic/loading.vue'),
    airDrop: () => import('@/components/airDrop.vue'),
  },
  methods: {
    async getListData() {
      this.showLoading = true;
      try {
        const data = await StakingRewardListbatch(this.ethersprovider, this.ethAddress, this.ethChainID);
        // console.log({ data });
        const tempLiquidity = data.filter((item) => item.kind === 'multi');
        // console.log({tempLiquidity});
        const result = [];
        const results = async () => {
          for (let index = 0; index < tempLiquidity.length; index++) {
            const item = tempLiquidity[index];
            const res = await this.getPriceData(item);
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
        // console.log(result);
        this.liquidityData = result;

        this.designatedData = data.filter((item) => item.kind === 'single');
      } catch (error) {
        console.log(error);
      } finally {
        // setTimeout(() => {
        this.showLoading = false;
        // }, 2000);
      }
    },
    async getPriceData(item) {
      const obj = {};
      const tokensymbolA = item.symbol[0];
      const tokensymbolB = item.symbol[1];
      const pledgeBalance = item && item.data && item.data.totalSupply;
      const pledgeBalanceWei = this.web3.utils.toWei(pledgeBalance.toString());
      const data = await readpariInfoNuminfoEarn(
        this.ethChainID,
        this.ethersprovider,
        tokensymbolA,
        tokensymbolB,
        pledgeBalanceWei
      );
      obj.usdtNum = data.aTokenbalance.multiply(data.price).add(data.bTokenbalance).toSignificant(6);
      obj.price = data.price && data.price.toSignificant(6);
      console.log(item);
      obj.img1 = getTokenImg(item.symbol[0],this.ethChainID);
      obj.img2 = getTokenImg(item.symbol[1],this.ethChainID);
      // if (tokensymbolA === 'GOAT' && tokensymbolB === 'LAMB') {
      //   this.$store.commit('changeScashPrice', obj.price);
      // }
      this.$store.commit('changeScashPrice', 100);
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
.rewardMine-wrapper {
  position: relative;
  width: 100%;
  // min-height: 700px;
}
</style>