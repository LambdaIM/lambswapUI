<template>
  <div class="dialog-wrap">
    <Modal
      v-model="isOpen"
      class-name="farm-modal"
      :transfer="true"
      :footer-hide="true"
      :closable="false"
    >
      <div class="modal-content">
        <div v-if="step === 1" class="flex">
          <div class="tab-wrapper">
            <button class="tab tab-disabled" @click="onMintClick">
              {{ $t('build-generate') }}
            </button>
          </div>
          <div class="tab-wrapper">
            <button class="tab">
              {{ $t('build-payback') }}
            </button>
          </div>
        </div>
        <div class="padding-wrapper">
          <div v-if="step === 1" class="step-one">
            <div class="grid-2">
              <h2>{{ $t('build-Amount') }}</h2>
              <p><span>{{ $t('build-balance') }}：</span> {{ BigNumber(scUSDNumber).toFixed(6) }} scUSD</p>
            </div>
            <div class="input-wrapper">
              <ScInput unit="scUSD" :on-change="onChangeValue" :is-error="checkValue !== 'ok'" />
              <img :src="getTokenImg('scUSD')" alt="scUSD">
            </div>
            <div v-if="checkValue !== 'ok'" class="notice-wrapper">
              <div class="notice-content">
                <img src="../../../../../assets/img/notice-red.png">
                <p>{{ checkValue }}</p>
              </div>
            </div>
            <div v-if="checkValue==='ok'" class="notice">
              <span>{{ $t('build-payback-scUSD') }}</span>
              <img src="../../../../../assets/img/wenhao.svg" alt="?">
            </div>
          </div>
          <div v-if="step === 2" class="step-two">
            <div class="title-wrapper">
              <img src="../../../../../assets/img/arrow-left.svg" alt="arrow" @click="changeStep">
              <h2>{{ $t('build-confirm') }}</h2>
            </div>
            <div class="confirm-content flex flex-col items-center">
              <img :src="getTokenImg('scUSD')" alt="scUSD">
              <h2>{{ coinAmount }}</h2>
              <p>scUSD</p>
              <span>{{ $t('build-will-payback') }}</span>
            </div>
          </div>
          <div class="items-content">
            <ul>
              <li class="title">
                {{ $t('build-debt') }}：
              </li>
              <li>
                <span>{{ BigNumber(existingDebt).toFixed(2) }} </span> {{ $t('build-to') }} <span
                  :class="{
                    'f-green': existingDebt < newDebt,
                    'f-danger': existingDebt > newDebt
                  }"
                >{{ BigNumber(newDebt).toFixed(2) }} {{ unit }}</span>
              </li>
            </ul>
            <ul>
              <li class="title">
                {{ $t('build-credit-line') }}：
              </li>
              <li>
                <span>{{ BigNumber(poolData.maxMintable).toFixed(2) }} </span> {{ $t('build-to') }} <span
                  :class="{
                    'f-green': poolData.maxMintable < currMaxMintable,
                    'f-danger': poolData.maxMintable > currMaxMintable
                  }"
                >{{ BigNumber(currMaxMintable).toFixed(2) }} {{ unit }}</span>
              </li>
            </ul>
            <ul>
              <li class="title flex">
                <span> {{ $t('build-coll-ratio') }}</span>
                <img src="../../../../../assets/img/wenhao.svg">
              </li>
              <li v-if="existingDebt">
                <span>{{ BigNumber(poolData.currentCollRX).times(100).toFixed(2) }}%</span> {{ $t('build-to') }} <span
                  :class="{
                    'f-green': newCollRX >= 5,
                    'f-warning': newCollRX < 5 && newCollRX > 2,
                    'f-danger': newCollRX <= 2
                  }"
                >{{ BigNumber(newCollRX).times(100).toFixed(2) }}%</span>
              </li>
              <li v-else>
                <span>0% {{ $t('build-to') }} 0%</span>
              </li>
            </ul>
            <ul>
              <li class="title">
                {{ $t('build-liquidation-price') }}
              </li>
              <li>
                <span>1{{ poolData.tokenName }} = {{ liquidationPrice }}</span> USD {{ $t('build-to') }} <span
                  :class="{
                    'f-green': liquidationPrice > newLiquidationPrice,
                    'f-danger': liquidationPrice < newLiquidationPrice
                  }"
                >{{ newLiquidationPrice }} USD</span>
              </li>
            </ul>
            <ul v-if="step===2">
              <li class="title">
                {{ $t('build-fee') }}
              </li>
              <li><span>{{ currFee }}</span> scUSD</li>
            </ul>
          </div>
          <div class="button-wrapper">
            <button v-if="step === 1 && checkValue === 'ok'" class="btn" @click="onNextClick">
              {{ $t('build-next') }}
            </button>
            <button v-if="step === 1 && checkValue !== 'ok'" class="btn btn-disabled">
              {{ $t('build-next') }}
            </button>
            <button v-if="step === 2" class="btn" @click="onBurnClick">
              {{ $t('build-confirm') }}
            </button>
          </div>
          <div v-if="step === 1" class="close-wrapper">
            <img src="../../../../../assets/img/closeBtn.svg" alt="closeBtn" @click="closeDialog">
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
.grid-2 {
  display: grid;
  grid-template-columns: 45% 45%;
  justify-content: space-between;
}
.btn {
  line-height: 50px;
  height: 50px;
  padding-top: 3px;
  background-color: #FF41A1;
  color: #ffffff;
  &:hover {
    background-color: #0547ff;
  }
}
.btn-disabled {
  cursor: not-allowed;
  background-color: #999;
  &:hover {
    background-color: #999 !important;
  }
}
.step-one,
.step-two {
  margin-top: 20px;
}
.modal-content {
  overflow: hidden;
  padding: 0 0 10px;

  .tab-wrapper {
    width: 50%;
    .tab {
      width: 100%;
      cursor: not-allowed;
      height: 60px;
      background: #ffffff;
      border-radius: 0px 12px 0px 0px;
    }
    .tab-disabled {
      width: 100%;
      cursor: pointer;
      height: 60px;
      color: #999;
      background: #f7f8f9;
      border-radius: 12px 0px 0px 0px;
    }
  }
  .padding-wrapper {
    padding: 0 44px 10px;
    .notice-wrapper {
      .notice-content {
        margin: 20px 0;
        display: flex;
        align-items: center;
        padding: 9px 30px;
        width: 100%;
        height: 32px;
        background: rgba(255, 60, 0, 0.1);
        border-radius: 4px;
        img {
          margin-right: 10px;
        }
        p {
          font-size: 12px;
          color: #ff3c00;
          line-height: 14px;
        }
      }
    }
    .step-one {
      h2 {
        height: 19px;
        font-size: 16px;
        color: #14171c;
        line-height: 19px;
      }
      p {
        height: 14px;
        font-size: 12px;
        line-height: 14px;
        text-align: right;
        span {
          color: #828489;
        }
      }
      .notice {
        height: 17px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #FF41A1;
        line-height: 17px;
        margin: 15px 0 0;
        display: flex;
        img {
          margin-left: 3px;
        }
      }
      .input-wrapper {
        margin-top: 8px;
        position: relative;
        img {
          width: 24px;
          position: absolute;
          right: 85px;
          top: 25px;
        }
      }
    }
    .step-two {
      .title-wrapper {
        img {
          cursor: pointer;
          position: absolute;
          left: 30px;
          top: 30px;
        }
        h2 {
          text-align: center;
          height: 28px;
          font-size: 24px;
          line-height: 28px;
        }
      }
      .confirm-content {
        margin-top: 32px;
        h2 {
          height: 47px;
          font-size: 40px;
          line-height: 47px;
        }
        p {
          height: 19px;
          font-size: 16px;
          line-height: 19px;
          margin: 8px 0;
        }
        span {
          height: 16px;
          font-size: 14px;
          color: #828489;
          line-height: 16px;
        }
      }
    }

    .items-content {
      margin: 32px 0;
      ul {
        display: flex;
        align-items: center;
        justify-content: space-between;
        li {
          text-align: right;
          padding-top: 8px;
          font-size: 12px;
          line-height: 14px;
        }
        .title {
          text-align: left;
          color: #828489;
        }
      }
    }
    .close-wrapper {
      width: 100%;
      margin-top: 32px;
      img {
        cursor: pointer;
        width: 24px;
        margin: auto;
      }
    }
  }
}
</style>
