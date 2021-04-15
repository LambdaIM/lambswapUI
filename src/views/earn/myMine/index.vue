<template>
  <div class="myPage-wrapper">
    <div v-if="showLoading">
      <loading />
    </div>
    <template v-else>
      <Table v-if="!isMobile" class="myPage-table-wrapper" :columns="columns" :data="data">
        <template slot="pool" slot-scope="{ row }">
          {{ row.name }}
        </template>

        <!-- <template slot="apy" slot-scope="{ row }">
          <span class="text-success">
            {{ row.data && row.data.rewardRate | formatReward(365, scashPrice, row.data && row.data.totalSupply) }}%
          </span>
        </template> -->
        <template slot="stake" slot-scope="{ row }">
          <span v-if="row.kind !== 'depositMLAMB'">{{ row.data && row.data.balance }}</span>
          <div v-else>
            <p>{{ row.data && row.data.balanceShare }} XmLAMB</p>
            <p class="asset">
              {{ row.data && row.data.myAsset }} mLAMB
            </p>
          </div>
        </template>
        <template slot="earned" slot-scope="{ row }">
          <span v-if="row.kind !== 'depositMLAMB'">
            {{ row.data && row.data.earned }} {{ row.data && row.data.rewardToken }}
          </span>
          <span v-else>--</span>
        </template>

        <template slot="operation" slot-scope="{ row }">
          <div v-if="row.kind !== 'depositMLAMB'" class="btn-wrapper flex justify-start items-center">
            <button class="table-btn claim" @click="openClaim(row)">
              {{ $t('myPage.table.claim') }}
            </button>
            <button class="table-btn stake" @click="openUnstake(row)">
              {{ $t('myPage.table.unstake') }}
              <span v-if="row.kind === 'multi'" class="ml-1">LP</span>
            </button>
          </div>

          <button v-else class="table-btn stake" @click="openUnstakeMLAMB(row)">
            {{ $t('myPage.table.unstake') }}
          </button>
        </template>
      </Table>

      <div class="m-card-wrapper">
        <div v-for="(item, index) in data" :key="index" class="m-card-item">
          <p class="mb-4">
            {{ item.name }}
          </p>
          <div class="point-item">
            <span class="title">{{ $t('myPage.table.stake') }}</span>
            <span class="value">{{ item.data && item.data.balance }}</span>
          </div>
          <div class="point-item">
            <span class="title">{{ $t('myPage.table.unclaim') }}</span>
            <span class="value">{{ item.data && item.data.earned }} {{ item.data && item.data.rewardToken }}</span>
          </div>

          <div class="m-btn-wrapper">
            <button class="claimBtn m-btn" @click="openClaim(item)">
              {{ $t('myPage.table.claim') }}
            </button>
            <button class="stakeBtn m-btn" @click="openUnstake(item)">
              {{ $t('myPage.table.unstake') }}
            </button>
          </div>
        </div>
      </div>
    </template>
    <div class="modal-wrapper">
      <takeDialog ref="take" />
      <extractDialog ref="extract" />
      <extractMLAMBDialog ref="extractMLAMB" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { StakingRewardListbatch } from '../utils/helpUtils/mineUtilFunc.js';
import { pairListEarn } from '@/contactLogic/readpairpool.js';
import event from '@/common/js/event';
import _ from 'underscore';
import { getFarmList } from '../utils/helpUtils/mineUtilFunc.js';
export default {
  data() {
    return {
      data: [],
      showLoading: false,
    };
  },
  components: {
    loading: () => import('@/components/basic/loading.vue'),
    takeDialog: () => import('./dialog/takeoutDialog.vue'),
    extractDialog: () => import('./dialog/extractReward.vue'),
    extractMLAMBDialog: () => import('./dialog/mLAMBTakeout.vue'),
  },
  methods: {
    async getListData() {
      this.showLoading = true;
      try {
        const mLambData = await getFarmList(this.ethersprovider, this.ethAddress, this.ethChainID);
        // const pairListPrice = await pairListEarn(this.ethChainID, this.ethersprovider);
        const data = (await StakingRewardListbatch(this.ethersprovider, this.ethAddress, this.ethChainID)) || [];
        // const [scashData] = data.filter((item) => item.symbol[0] === 'GOAT' && item.symbol[1] === 'LAMB');
        // console.log(scashData);
        // await this.getPriceData(scashData, pairListPrice);
        this.data = data.concat(mLambData);
      } catch (error) {
        console.log(error);
      } finally {
        this.showLoading = false;
      }
    },
    async getPriceData(item, pairListPrice) {
      const tokensymbolA = item.symbol[0];
      const tokensymbolB = item.symbol[1];

      // 匹配读取价格信息
      const priceItem = _.find(pairListPrice, (pairItem) => {
        if (
          (pairItem.pairInfo.tokenAmounts[0].token.symbol === tokensymbolA &&
            pairItem.pairInfo.tokenAmounts[1].token.symbol === tokensymbolB) ||
          (pairItem.pairInfo.tokenAmounts[1].token.symbol === tokensymbolA &&
            pairItem.pairInfo.tokenAmounts[0].token.symbol === tokensymbolB)
        ) {
          return pairItem;
        }
      });

      // 构造价格相关信息
      const data = {
        price: priceItem.price(tokensymbolA, tokensymbolB).price,
      };

      const price = data.price && data.price.toSignificant(6);
      this.$store.commit('changeScashPrice', price);
    },
    openClaim(data) {
      this.$refs.extract.open(data);
    },
    openUnstake(data) {
      this.$refs.take.open(data);
    },
    openUnstakeMLAMB(data) {
      this.$refs.extractMLAMB.open(data);
    },
  },
  computed: {
    ...mapState(['ethersprovider', 'ethChainID', 'ethAddress', 'scashPrice', 'web3', 'isMobile']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
    columns() {
      const columns = [
        {
          title: this.$t('myPage.table.pool'),
          slot: 'pool',
        },
        // {
        //   title: this.$t('myPage.table.apy'),
        //   slot: 'apy',
        // },
        {
          title: this.$t('myPage.table.stake'),
          slot: 'stake',
        },
        {
          title: this.$t('myPage.table.unclaim'),
          slot: 'earned',
        },
        {
          title: this.$t('myPage.table.function'),
          slot: 'operation',
          minWidth: 140,
        },
      ];
      return columns;
    },
  },
  watch: {
    isReady(value) {
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
.myPage-wrapper {
  background: #ffffff;
  border-radius: 12px;
  .pageTitle {
    font-size: 20px;
    line-height: 24px;
  }
  .myPage-table-wrapper {
    margin-top: 8px;
    .table-btn {
      width: 100px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 6px;
      font-size: 14px;
      line-height: 16px;
    }
    .claim {
      margin-right: 12px;
      color: #fff;
      background: #ff41a1;
    }
    .stake {
      border: 1px solid #ff41a1;
      color: #ff41a1;
    }
    .asset{
      margin-top: 8px;
      font-size: 14px;
      color: rgb(141, 138, 138);
    }
  }
}
</style>