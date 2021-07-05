<template>
  <div class="list-wrapper">
    <div class="list-item-wrapper">
      <template v-if="!isMobile">
        <div v-for="(item, index) in data" :key="index">
          <div v-if="item.isHide === false" class="list-item pc-list-item">
            <div class="name flex justify-start items-center">
              <div class="img-wrapper">
                <img :src="item.img2" alt="susd">
                <img :src="item.img1" alt="susd" class="imgRight">
              </div>
              <div class="right">
                <p class="coin">
                  {{ item.name }}
                </p>
                <p v-if="item.kind === 'multi'" class="price">
                  1 {{ item.symbol && item.symbol[0] }} = {{ item.price | formatNormalValue }}
                  {{ item.symbol && item.symbol[1] }}
                </p>
              </div>
            </div>

            <div class="apy">
              <h4>{{ $t('earn.card.apy') }}</h4>
              <p class="percent">
                {{
                  item.data &&
                    item.data.rewardRate
                    | formatReward(365, scashPrice, item.data && item.data.totalSupply, item.poolValue)
                }}%
              </p>
            </div>

            <div class="balance">
              <div class="balance-item">
                <span class="title">{{ $t('earn.card.totalStaked') }}</span>
                <span class="value">{{ (item.data && item.data.totalSupply) || 0 }} LP</span>
              </div>
              <div class="balance-item">
                <span class="title">{{ $t('earn.card.totalPool') }}</span>
                <span v-if="item.kind === 'multi'" class="value">
                  {{ item.poolValue || '--' }} {{ item.symbol && item.symbol[1] }}
                </span>
                <span v-if="item.kind === 'single'" class="value">
                  {{ item.data && (item.data.totalSupply * earnPrice) | formatNormalValue }}
                </span>
              </div>
              <div class="balance-item">
                <span class="title">{{ $t('earn.card.output') }}</span>
                <span class="value">{{ item.daynum }} GOAT</span>
              </div>
            </div>

            <div class="btn-item">
              <template v-if="ethAddress">
                <button v-if="item.Expired === true" class="whitespace-nowrap stakeBtn disableBtn">
                  {{ $t('earn.card.expired') }}
                </button>
                <button v-else class="stakeBtn" @click="openStake(item)">
                  {{ $t('earn.card.stake') }}
                </button>
              </template>
              <Buttons v-else width="100px" height="30px" border-radius="18px" class="disableBtn">
                {{ $t('earn.card.stake') }}
              </Buttons>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="(item, index) in data" :key="index + 10">
          <div v-if="item.isHide === false" class="mobile-list-item">
            <div class="m-img-wrapper">
              <div class="m-img-box">
                <img :src="item.img2" alt="susd">
                <img :src="item.img1" alt="susd" class="imgRight">
              </div>
            </div>

            <div class="m-price-wrapper">
              <p class="name">
                {{ item.name }}
              </p>
              <p v-if="item.kind === 'multi'" class="price">
                1 {{ item.symbol && item.symbol[0] }} = {{ item.price | formatNormalValue }}
                {{ item.symbol && item.symbol[1] }}
              </p>
            </div>

            <div class="m-point-wrapper">
              <div class="point-item">
                <span class="title">{{ $t('earn.card.apy') }}</span>
                <span class="value text-success">
                  {{
                    item.data &&
                      item.data.rewardRate
                      | formatReward(365, scashPrice, item.data && item.data.totalSupply, item.poolValue)
                  }}%
                </span>
              </div>
              <div class="point-item">
                <span class="title">{{ $t('earn.card.totalStaked') }}</span>
                <span class="value">{{ (item.data && item.data.totalSupply) || 0 }} LP</span>
              </div>

              <div class="point-item">
                <span class="title">{{ $t('earn.card.totalPool') }}</span>
                <span v-if="item.kind === 'multi'" class="value">
                  {{ item.poolValue || '--' }} {{ item.symbol && item.symbol[1] }}
                </span>
                <span v-if="item.kind === 'single'" class="value">
                  {{ item.data && (item.data.totalSupply * earnPrice) | formatNormalValue }}
                </span>
              </div>

              <div class="point-item">
                <span class="title">{{ $t('earn.card.output') }}</span>
                <span class="value">{{ item.daynum }} GOAT</span>
              </div>
            </div>

            <div class="m-btn-wrapper">
              <template v-if="ethAddress">
                <button v-if="item.name === 'mLAMB/LAMB LP'" class="stakeBtn disableBtn">
                  {{ $t('earn.card.expired') }}
                </button>
                <button v-else class="stakeBtn" @click="openStake(item)">
                  {{ $t('earn.card.stake') }}
                </button>
              </template>
              <button v-else class="stakeBtn disableBtn">
                {{ $t('earn.card.stake') }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });
export default {
  props: {
    data: {
      type: Array,
    },
  },
  methods: {
    openStake(data) {
      this.$emit('openStake', data);
    },
  },
  components: {
    Buttons: () => import('@/components/basic/buttons.vue'),
  },
  computed: {
    ...mapState(['earnPrice', 'ethAddress', 'scashPrice', 'isMobile']),
  },
};
</script>

<style lang="less" scoped>
@import '../media/media.less';
.list-wrapper {
  margin-top: 24px;
  .list-item {
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    // justify-content: space-between;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 16px;
    .img-wrapper {
      margin-right: 16px;
      width: 72px;
      height: 48px;
      position: relative;
      img {
        max-width: 48px;
        position: absolute;
        left: 0;
        bottom: 0;
      }
      .imgRight {
        left: 24px;
      }
    }
    .name {
      margin-right: 24px;
      word-break: break-all;
      width: 28%;
      .right {
        margin-left: 28px;
        .coin {
          font-size: 20px;
          line-height: 24px;
        }
        .price {
          margin-top: 4px;
          font-size: 14px;
          color: #828489;
          line-height: 16px;
        }
      }
    }
    .apy {
      width: 22%;
      word-break: break-all;
      margin-right: 24px;
      h4 {
        font-size: 14px;
        color: #828489;
        line-height: 16px;
      }
      .percent {
        font-size: 32px;
        color: #00d075;
        line-height: 38px;
      }
    }
    .balance {
      width: 28%;
      .balance-item {
        margin-bottom: 4px;
        overflow: hidden;
        .title {
          float: left;
          font-size: 14px;
          color: #8690a8;
          line-height: 16px;
          // margin-right: 50px;
        }
        .value {
          float: right;
          font-size: 14px;
          line-height: 16px;
        }
      }
    }
    .btn-item {
      margin-left: 50px;
      .stakeBtn {
        background: #ff41a1;
        border-radius: 18px;
        padding: 8px 40px;
        font-size: 16px;
        color: #ffffff;
        line-height: 19px;
      }
    }
  }
}
</style>