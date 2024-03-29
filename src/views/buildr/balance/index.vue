<template>
  <div class="balance">
    <div class="overview-wrapper">
      <Overview />
    </div>
    <div class="CDP-content">
      <div class="title2">
        {{ $t('build-my-vaults') }}
      </div>
      <div v-if="!poolsData.length">
        <Loading />
      </div>
      <div v-for="poolItem in poolsData" :key="poolItem.tokenTitle">
        <div class="pool-item-warp">
          <div class="item-top">
            <div>
              <span>{{ $t('build-target-coll-ratio') }}</span>
              <span class="f-green">
                {{ BigNumber(poolItem.targetRX).times(100).toFixed(2) }}%
              </span>
            </div>
            <div class="text-right">
              <span>{{ $t('build-liquidation-price') }}: <span class="f-danger">{{ getLiquidationPrice(poolItem) }} USD</span></span>
              <span>{{ $t('build-liquidation-ratio') }}: <span
                class="f-warning"
              >{{ BigNumber(poolItem.liquidationRX).times(100) }}%</span></span>
              <span>{{ $t('build-stability-fee') }}: <span class="f-warning">{{ BigNumber(poolItem.feeRate).times(100) }}%</span></span>
            </div>
          </div>
          <div class="CDP-item">
            <div class="small-item pool-wapper flex flex-col items-center">
              <img :src="getTokenImg(poolItem.tokenName)" :alt="poolItem.tokenName">
              <div>{{ poolItem.tokenTitle }}</div>
            </div>
            <div class="small-item line">
              <div>
                <span>{{ $t('build-current-coll-ratio') }}</span>
                <div class="circle-wapper">
                  <span
                    :class="{
                      'bg-green': poolItem.currentCollRX >= 5,
                      'bg-warning': poolItem.currentCollRX < 5 && poolItem.currentCollRX > 2,
                      'bg-danger': poolItem.currentCollRX <= 2
                    }"
                  />
                  <p
                    :class="{
                      'f-green': poolItem.currentCollRX >= 5,
                      'f-warning': poolItem.currentCollRX < 5 && poolItem.currentCollRX > 2,
                      'f-danger': poolItem.currentCollRX <= 2
                    }"
                  >
                    {{ BigNumber(poolItem.currentCollRX).times(100).toFixed(2) }}%
                  </p>
                </div>
              </div>
              <div class="mrg-tb-20">
                <span>{{ $t('build-current-price') }}</span>
                <p class="f-green">
                  {{ BigNumber(poolItem.currencyPrice).toFixed(6) }} USD
                </p>
              </div>
            </div>
            <div class="small-item text-center">
              <div>
                <span>{{ $t('build-Deposited') }}</span>
                <p>
                  {{ BigNumber(poolItem.pledgeNumber) }} {{ poolItem.tokenName }}
                </p>
              </div>
              <div class="mrg-tb-10">
                <button class="btn" @click="openJoinDialog(poolItem)">
                  {{ $t('build-Deposit') }}
                </button>
              </div>
              <div>
                <a href="javascript:;" @click="openExitDialog(poolItem)">{{ $t('build-avail-to-withdraw') }}
                  {{ BigNumber(poolItem.unlockedCollateral).toFixed(2) }} {{ poolItem.tokenName }}</a>
              </div>
            </div>
            <div class="small-item text-center">
              <div>
                <span>{{ $t('build-current-credit-line') }}</span>
                <p>
                  {{ BigNumber(poolItem.maxMintable).toFixed(2) }} scUSD
                </p>
              </div>
              <div class="mrg-tb-10">
                <button class="btn" @click="openMintDialog(poolItem)">
                  {{ $t('build-generate') }}
                </button>
              </div>
              <div>
                <a href="javascript:;" @click="openBurnDialog(poolItem)">{{ $t('build-current-debt') }}
                  {{ BigNumber(poolItem.currentDebt).toFixed(2) }} scUSD</a>
              </div>
            </div>
            <div class="btn-wrapper" />
          </div>
        </div>
      </div>
    </div>
    <div class="modal-wrapper">
      <JoinDialog ref="tokenJoin" />
      <MintDialog ref="tokenMint" />
      <BurnDialog ref="tokenBurn" />
      <ExitDialog ref="tokenExit" />
    </div>
    <haveSendDialog ref="haveSendtx" />
  </div>
</template>

<script src="./index.js" ></script>
<style lang="less">
.f-green {
  color: #00d075 !important;
}
.f-warning {
  color: rgba(255, 181, 0, 1) !important;
}
.f-danger {
  color: #ff3c00 !important;
}
.bg-green {
  background-color: #00d075 !important;
}
.bg-warning {
  background-color: rgba(255, 181, 0, 1) !important;
}
.bg-danger {
  background-color: #ff3c00 !important;
}

.balance {
  margin-top: 24px;
  .title2 {
    height: 24px;
    font-size: 20px;
    line-height: 24px;
  }
  .CDP-content {
    margin: 24px 0px 50px 0px;
    padding: 32px 44px;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    .pool-item-warp {
      margin-top: 24px;
      padding: 24px;
      box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    }
    .item-top {
      display: grid;
      grid-template-columns: 30% 70%;
      justify-content: space-between;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      span {
        color: #828489;
      }
      .text-right {
        text-align: right;
        > span {
          margin-left: 20px;
        }
      }
    }
    .CDP-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-top: 24px;
      .small-item {
        width: 25%;
        .circle-wapper {
          display: flex;
          align-items: center;
          span {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
          }
        }
        div {
          span {
            height: 16px;
            font-size: 14px;
            color: #828489;
            line-height: 16px;
          }
          p {
            height: 19px;
            font-size: 20px;
            line-height: 19px;
            margin-top: 5px;
          }
          a {
            text-decoration: underline;
          }
        }
      }
      .line {
        width: 30%;
        position: relative;
      }
      .line::after {
        content: "";
        width: 2px;
        height: 90px;
        background: rgba(0, 0, 0, 0.06);
        position: absolute;
        right: 90px;
        top: 23px;
      }
      .pool-wapper{
        width: 18%;
      }

      .btn {
        margin-left: 25%;
        width: 160px;
        height: 36px;
        line-height: 36px;
        border-radius: 18px;
        background-color: #FF41A1;
        color: rgb(255, 255, 255);
        &:hover {
          background-color: #0025ff;
        }
      }
    }
  }
}
</style>
