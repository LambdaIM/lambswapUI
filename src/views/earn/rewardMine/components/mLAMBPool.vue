<template>
  <div v-if="!isMobile" class="mlambPool-wrapper mb-6">
    <div class="title-wrapper flex justify-between items-center">
      <div class="left">
        <span class="title">{{ $t('earn.combine.t1') }}</span>
        <!-- <span class="next">{{ $t('liquidity.mlambPool.next') }}</span> -->
      </div>
      <div class="right">
        {{ $t('earn.combine.t2') }}
      </div>
    </div>
    <div class="mlambPool-content-wrapper flex justify-items-start items-center">
      <div class="mlambPool-item name">
        <img src="../../../../assets/img/mlamb48.svg" alt="mlambda">
        <span>mLAMB</span>
      </div>

      <div class="mlambPool-item volume">
        <p class="drop-title">
          {{ $t('earn.card.apy') }}
        </p>
        <p class="drop-num">
          {{ listData.data && listData.data.apy }}%
        </p>

        <!-- <p class="tag">
          <span class="mine font10px">{{ $t('liquidity.mlambPool.tag') }}</span>
        </p> -->
      </div>

      <div class="mlambPool-item countdown">
        <p class="drop-title">
          {{ $t('earn.card.asset') }}
        </p>
        <p class="mt-1">
          {{ listData && listData.data && listData.data.totalAsset }} mLAMB
        </p>
      </div>

      <div class="mlambPool-item create">
        <button v-if="ethAddress" class="createBtn" @click="openDialog">
          {{ $t('earn.card.stakeBtn') }}
        </button>
        <button v-else class="createBtn disableBtn">
          {{ $t('earn.card.stakeBtn') }}
        </button>
      </div>
    </div>

    <pledgeDialog ref="pledge" />
  </div>

  <div v-else class="mlambPool-wrapper m-mlambPool-wrapper mb-6">
    <div class="title-wrapper flex justify-between items-center">
      <div class="left">
        <span class="title">{{ $t('earn.combine.t1') }}</span>
        <!-- <span class="next">{{ $t('liquidity.mlambPool.next') }}</span> -->
      </div>
      <div class="right">
        {{ $t('earn.combine.t2') }}
      </div>
    </div>
    <div class="mlambPool-Mobile">
      <div class="mlambPool-item name">
        <img src="../../../../assets/img/mlamb48.svg" alt="mlambda">
        <span>mLAMB</span>
      </div>

      <div class="mlambPool-item volume flex items-center justify-between">
        <p class="drop-title">
          APY
        </p>
        <p class="drop-num">
          100%
        </p>

        <!-- <p class="tag">
          <span class="mine font10px">{{ $t('liquidity.mlambPool.tag') }}</span>
        </p> -->
      </div>

      <div class="mlambPool-item countdown flex items-center justify-between">
        <p class="drop-title">
          总资产
        </p>
        <p class="mt-1">
          {{ listData && listData.data && listData.data.totalAsset }} XmLAMB
        </p>
      </div>

      <div class="mlambPool-item create">
        <button v-if="ethAddress" class="createBtn" @click="openDialog">
          {{ $t('earn.card.stakeBtn') }}
        </button>
        <button v-else class="createBtn disableBtn">
          {{ $t('earn.card.stakeBtn') }}
        </button>
      </div>
    </div>

    <pledgeDialog ref="pledge" />
  </div>
</template>

<script>
// import event from '@/common/js/event';
import { getFarmList } from '../../utils/helpUtils/mineUtilFunc.js';
import { mapState } from 'vuex';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });
import axios from 'axios';
export default {
  data() {
    return {
      listData: {},
    };
  },
  components: {
    countDown: () => import('@/components/basic/countDown.vue'),
    pledgeDialog: () => import('../dialog/mlambPledge/mlambPledge.vue'),
  },
  computed: {
    ...mapState(['ethChainID', 'ethAddress', 'ethersprovider', 'isMobile']),
    isReady() {
      return this.ethChainID && this.ethersprovider;
    },
    isConnect() {
      return this.ethChainID && this.ethersprovider && this.ethAddress;
    },
  },
  watch: {
    isConnect() {
      this.getList();
    },
  },
  methods: {
    openDialog() {
      this.$refs.pledge.open(this.listData);
    },
    async getList() {
      try {
        const chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        const [result] = await getFarmList(library, account, chainID);
        this.listData = result;
        console.log({ result });
      } catch (error) {
        console.log(error);
      }
    },
    async getReward() {
      try {
        const lambdata = await axios.get(`http://explorer.lambdastorage.com/api/proxy/pledgeInfo`);
        console.log({ lambdata });
      } catch (error) {
        console.log(error);
      }
    },
    getAPY() {
      return '0';
    }
  },
  mounted() {
    // this.getReward();
    if (this.isReady) {
      this.getList();
    }
  },
};
</script>

<style lang="less" scoped>
@import '../media/media.less';
.mlambPool-wrapper {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .title-wrapper {
    .left {
      .title {
        font-size: 20px;
        font-weight: 500;
        color: #14171c;
        line-height: 24px;
      }
      .next {
        margin-left: 20px;
        margin-right: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #8690a8;
        line-height: 16px;
      }
      .time {
        font-size: 14px;
        font-weight: 500;
        color: #00d075;
        line-height: 16px;
      }
    }
    .right {
      font-size: 16px;
      font-weight: 400;
      color: #8690a8;
      line-height: 19px;
    }
  }
  .mlambPool-content-wrapper {
    width: 100%;
    margin-top: 24px;
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    .name {
      width: 28%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      margin-right: 24px;
      span {
        margin-left: 28px;
        font-size: 20px;
        color: #14171c;
        line-height: 24px;
      }
    }
    .volume {
      width: 22%;
      margin-right: 24px;
      .drop-num {
        margin-top: 8px;
        font-size: 32px;
        color: #00d075;
        line-height: 30px;
        span {
          font-size: 16px;
          color: #14171c;
          line-height: 19px;
        }
      }
      .tag {
        .mine {
          margin-right: 4px;
          padding: 4px;
          background: rgba(0, 208, 117, 0.2);
          border-radius: 2px;
          color: #00d075;
          line-height: 11px;
        }
        .reward {
          padding: 4px;
          background: rgba(135, 87, 236, 0.2);
          border-radius: 2px;
          color: #8757ec;
          line-height: 11px;
        }
      }
    }
    .countdown {
      width: 28%;
      .count {
        margin-top: 14px;
      }
    }
    .create {
      margin-left: 50px;
    }
  }
}
.createBtn {
  font-size: 16px;
  color: #ffffff;
  line-height: 19px;
  padding: 8px 25px;
  background: #ff41a1;
  border-radius: 18px;
}
.drop-title {
  font-size: 14px;
  color: #8690a8;
  line-height: 16px;
}
</style>
