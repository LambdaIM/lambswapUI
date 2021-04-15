<template>
  <div class="remove-dialog">
    <Modal v-model="openRemoveDialog" class-name="remove-modal" :footer-hide="true" :closable="true">
      <div class="remove-content">
        <p class="title text-center">
          {{ $t('myPage.dialog.unstake.unstake') }} XmLAMB
        </p>
        <div class="remove-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('common.amount') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('myPage.dialog.unstake.staked') }} XmLAMB</span>
              <span>{{ pledgeBalance }}</span>
            </div>
          </div>
          <div class="remove-wrapper flex">
            <input v-model.number="stakeVal" type="number" class="amount-input" @input="handleInput">
          </div>
        </div>
        <div class="price-warpper">
          <div class="price-item">
            <span>{{ $t('myPage.dialog.unstake.unstake') }} XmLAMB</span>
            <p>{{ stakeVal }} XmLAMB</p>
          </div>
        </div>

        <div class="btn-warpper">
          <Buttons v-if="!takeLoading" @click.native="sendTakeout">
            {{ $t('common.confirm') }}
          </Buttons>
          <Buttons v-else>
            {{ $t('common.loading') }}...
          </Buttons>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { useSushiBarLeave } from '../../utils/helpUtils/mineUtilFunc.js';
import event from '@/common/js/event';
const BigNumber = require('bignumber.js');
import Web3 from 'web3';
import { Token } from '@webfans/uniswapsdk';
export default {
  inject: ['reload'],
  data() {
    return {
      openRemoveDialog: false,
      data: {},
      coinName: '',
      stakeVal: '',
      takeLoading: false,
      previousData: '',
      pledgeBalance: '',
    };
  },
  methods: {
    // 限制Input输入小数点的长度
    handleInput(e) {
      const stringValue = e.target.value.toString();
      const regex = /^\d*(\.\d{1,6})?$/;
      if (!stringValue.match(regex) && this.stakeVal !== '') {
        this.stakeVal = this.previousData;
      }
      this.previousData = this.stakeVal;
    },
    open(data) {
      this.data = {};
      this.data = data;
      this.pledgeBalance = data && data.data && data.data.balanceShare;
      this.openRemoveDialog = true;
    },

    // 检验数据是否合法
    checkData() {
      const balance = this.pledgeBalance;
      const bigBalance = new BigNumber(balance);
      const amount = new BigNumber(this.stakeVal);
      if (this.stakeVal === '') {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n30'),
        });
        return false;
      }
      if (parseFloat(this.stakeVal) <= 0) {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n31'),
        });
        return false;
      }
      // console.log(amount.toNumber(),bigBalance.toNumber(),amount.isGreaterThan(bigBalance));
      if (amount.isGreaterThan(bigBalance)) {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n29'),
        });
        return false;
      }

      return true;
    },

    // 取出LP
    async sendTakeout() {
      if (!this.checkData()) {
        return false;
      }
      this.takeLoading = true;

      try {
        const library = this.ethersprovider;
        const account = this.ethAddress;

        const chainId = this.ethChainID;
        const address = this.data && this.data.address;
        const decimals = this.data && this.data.decimals;
        const symbol = this.data && this.data.symbol;

        const tokenData = new Token(chainId, address, decimals, symbol);

        const amount = Web3.utils.toWei(this.stakeVal.toString(), 'ether');
        const result = await useSushiBarLeave(library, account, tokenData, amount);

        event.$emit('sendSuccess');
        this.openRemoveDialog = false;
        event.$emit('sendtx', [
          result,
          {
            okinfo: `${this.$t('common.unstake')} ${this.stakeVal} XmLAMB ${this.$t('notice.n42')}`,
            failinfo: `${this.$t('common.unstake')} ${this.stakeVal} XmLAMB ${this.$t('notice.n43')}`,
          },
        ]);
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          title: this.$t('notice.n32'),
        });
      } finally {
        this.openRemoveDialog = false;
        this.takeLoading = false;
      }
    },
  },
  components: {
    Buttons: () => import('@/components/basic/buttons'),
  },
  computed: {
    ...mapState(['ethersprovider', 'ethAddress','ethChainID']),
  },
};
</script>

<style lang="less" scoped>
.remove-modal {
  width: 500px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .remove-content {
    padding: 14px 28px;
    .title {
      height: 28px;
      font-size: 24px;

      font-weight: 500;
      color: #14171c;
      line-height: 28px;
      margin-bottom: 24px;
    }

    .remove-wrapper {
      .title-content {
        overflow: hidden;
        margin: 24px 0 8px;
        span {
          float: left;
        }
        .balance-item {
          float: right;
          font-size: 12px;
          font-weight: 500;
          line-height: 14px;
        }
      }
      .amount-input {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        background: #f7f8f9;
        font-size: 40px;
        line-height: 47px;
        color: #14171c;
        padding: 16px;
        caret-color: #ff41a1;
        &:focus {
          border: 1px solid #ff41a1;
          border-radius: 4px;
        }
      }
    }

    .price-warpper {
      margin-top: 30px;
      .price-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      span {
        height: 14px;
        font-size: 12px;

        font-weight: 500;
        color: #828489;
        line-height: 14px;
      }
      p {
        height: 14px;
        font-size: 12px;

        font-weight: 500;
        color: #14171c;
        line-height: 14px;
        margin-bottom: 8px;
      }
    }
    .btn-warpper {
      margin-top: 24px;
      .button-wrapper {
        height: 48px;
      }
    }
  }
}
</style>