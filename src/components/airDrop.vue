<template>
  <div class="airdrop-wrapper mb-6">
    <div class="title-wrapper flex justify-between items-center">
      <div class="left">
        <span class="title">LAMB</span>
        <span class="next">{{ $t('liquidity.airdrop.next') }}</span>
        <span class="time">2021.4.6 10:00(UTC+8)</span>
      </div>
      <div class="right">
        {{ $t('liquidity.airdrop.subTitle') }}
      </div>
    </div>
    <div class="airdrop-content-wrapper flex justify-between items-center">
      <div class="airdrop-item name">
        <img src="../assets/img/lambda48.svg" alt="lambda">
        <span>LAMB</span>
      </div>

      <div class="airdrop-item volume">
        <p class="drop-title">
          {{ $t('liquidity.airdrop.title1') }}
        </p>
        <p class="drop-num">
          2000000
          <span>LAMB</span>
        </p>

        <p class="tag">
          <span class="mine font10px">{{ $t('liquidity.airdrop.tag') }}</span>
          <!-- <span class="reward font10px">LAMB Airdrop</span> -->
        </p>
      </div>

      <div class="airdrop-item countdown">
        <p class="drop-title">
          {{ $t('liquidity.airdrop.count') }}
        </p>
        <!-- <div class="count"> -->
        <!-- <countDown class="count" date="2021-04-06T10:00:00+08:00" /> -->
        <countDown class="count" date="2021-04-02T19:08:00+08:00" />
        <!-- </div> -->
      </div>

      <div class="airdrop-item create">
        <button v-if="!isAbleOpen || !ethAddress" class="createBtn disableBtn">
          {{ $t('liquidity.airdrop.extract') }}
        </button>
        <button v-if="isAbleOpen && ethAddress" class="createBtn" @click="openExtract">
          {{ $t('liquidity.airdrop.extract') }}
        </button>
      </div>
    </div>

    <extractDialog ref="extract" />
  </div>
</template>

<script>
import event from '@/common/js/event';
import { userAirDropValue } from '@/contactLogic/AirDrop.js';
import { mapState } from 'vuex';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });
export default {
  data() {
    return {
      isAbleOpen: false,
      unclaim: '',
    };
  },
  components: {
    countDown: () => import('@/components/basic/countDown.vue'),
    extractDialog: () => import('@/components/extractDialog'),
  },
  props: {
    data: {
      type: Array,
    },
  },
  computed: {
    ...mapState(['ethChainID', 'ethAddress', 'ethersprovider']),
    isReady() {
      return this.ethChainID && this.ethersprovider && this.ethAddress;
    },
  },
  isReady(value) {
    if (value) {
      this.airDropRead();
    }
  },
  methods: {
    openExtract() {
      this.$refs.extract.open(this.unclaim);
    },
    async airDropRead() {
      try {
        const chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        const result = await userAirDropValue(library, account, chainID);
        this.unclaim = new BigNumber(result.toString()).div('1e18').decimalPlaces(2).toNumber();
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    if (this.isReady) {
      this.airDropRead();
    }
    event.$on('open', () => {
      this.isAbleOpen = true;
    });
  },
};
</script>

<style lang="less" scoped>
.airdrop-wrapper {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 32px 44px 44px 44px;
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
  .airdrop-content-wrapper {
    width: 100%;
    margin-top: 24px;
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    padding: 32px 24px;
    .name {
      width: 20%;
      display: flex;
      flex-direction: row;
      justify-self: space-between;
      align-items: center;
      span {
        margin-left: 28px;
        font-size: 20px;
        color: #14171c;
        line-height: 24px;
      }
    }
    .volume {
      width: 20%;
      .drop-num {
        margin-top: 8px;
        font-size: 26px;
        color: #14171c;
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
      width: 30%;
      .count {
        margin-top: 14px;
      }
    }
  }
}
.createBtn {
  font-size: 16px;
  color: #ffffff;
  line-height: 19px;
  padding: 8px 16px;
  background: #0058ff;
  border-radius: 18px;
}
.drop-title {
  font-size: 14px;
  color: #8690a8;
  line-height: 16px;
}
</style>
