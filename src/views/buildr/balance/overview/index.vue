<template>
  <div class="overview-warp">
    <div class="content-wrapper flex items-center">
      <div class="content">
        <div class="total-wrapper">
          <h2>{{ $t('build-total-collateral-value') }}</h2>
          <p><span>{{ BigNumber(totalValue).toFixed(2) }}</span> USD</p>
        </div>
        <div class="other-wrapper flex items-center">
          <div>
            <h2>{{ $t('build-total-debt') }}</h2>
            <p><span>-{{ BigNumber(totalDebt).toFixed(2) }}</span> scUSD </p>
          </div>
          <div>
            <h2>{{ $t('build-scUSD-credit-line') }}</h2>
            <p><span>{{ BigNumber(totalMaxMintable).toFixed(2) }}</span> scUSD </p>
          </div>
          <div>
            <h2>{{ $t('build-stability-fee') }}</h2>
            <p><span>{{ BigNumber(totalFee).toFixed(2) }}</span> scUSD</p>
          </div>
        </div>
        <div class="refresh" @click="refresh">
          <img src="../../../../assets/img/refresh.svg" alt="refresh">
        </div>
      </div>
      <div class="content-gray">
        <span />
      </div>
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
.overview-warp {
  .title {
    height: 24px;
    font-size: 20px;
    line-height: 24px;
  }
  .content-wrapper {
    margin-top: 24px;
    .content {
      margin-right: 24px;
      width: 56%;
      background: linear-gradient(270deg, #3f5efb 0%, #fc466b 100%);
      border-radius: 12px;
      padding: 24px;
      position: relative;
      div {
        h2 {
          height: 16px;
          font-size: 14px;
          color: #ffffff;
          line-height: 16px;
        }
        p {
          height: 24px;
          font-size: 20px;
          color: #ffffff;
          line-height: 24px;
          margin-top: 8px;
        }
      }
      .total-wrapper {
        p {
          height: 38px;
          font-size: 32px;
          font-family: Gilroy-Bold, Gilroy;
          font-weight: bold;
          color: #ffffff;
          line-height: 38px;
          margin: 8px 0 16px;
        }
      }
      .other-wrapper {
        padding-top: 10px;
        div {
          width: 30%;
        }
      }
      .refresh{
        cursor: pointer;
        position: absolute;
        right: 20px;
        top: 20px;
      }
    }
    .content-gray {
      flex: 1;
      width: 20%;
      height: 184px;
      background: #2c3340;
      border-radius: 12px;
    }
  }
}
</style>
