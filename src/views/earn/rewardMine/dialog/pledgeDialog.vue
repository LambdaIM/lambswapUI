<template>
  <div class="pledge-dialog">
    <Modal v-model="openPledgeDialog" class-name="pledge-modal" :transfer="false" :footer-hide="true" :closable="true">
      <div v-if="isShowPledge" class="pledge-content">
        <p class="title text-center">
          {{ $t('earn.card.stake') }} {{ data.name }}
        </p>
        <div class="pledge-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('earn.dialog.stakeDialog.amount') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ data.name }} {{ $t('earn.dialog.stakeDialog.balance') }}</span>
              <span>{{ data.data && data.data.LPTokenbalance }}</span>
            </div>
          </div>
          <div class="pledge-wrapper flex">
            <input
              v-model.number="pledgeAmount"
              type="number"
              class="amount-input"
              pattern="[0-9]*.?[0-9]{0,6}"
              @keyup="checkApprove"
              @input="handleInput"
            >
          </div>

          <div class="percentage">
            <div @click="percentage(0.25)">
              25%
            </div>
            <div @click="percentage(0.5)">
              50%
            </div>
            <div @click="percentage(0.75)">
              75%
            </div>
            <div @click="percentage(1)">
              {{ $t('earn.dialog.stakeDialog.max') }}
            </div>
          </div>
        </div>
        <div class="price-wrapper">
          <div class="price-item">
            <span>{{ $t('earn.dialog.stakeDialog.totalStakePool') }}</span>
            <p>{{ data.data && data.data.totalSupply }} {{ data.name }}</p>
          </div>
          <!-- <div class="price-item">
            <span>{{ $t('earn.dialog.stakeDialog.yield') }}</span>
            <p>{{ data.data && data.data.rewardRate | formatRate }}</p>
          </div> -->
          <div class="price-item">
            <span>{{ $t('earn.dialog.stakeDialog.willStake') }}</span>
            <p>{{ pledgeAmount || 0 }} {{ data.name }}</p>
          </div>
          <!-- <div class="price-item">
            <span>{{ $t('earn.dialog.stakeDialog.sharePool') }}</span>
            <p>
              <span class="sharePool">{{ increaseRate }}</span>
              to {{ totalRate }}
            </p>
          </div> -->
        </div>

        <div class="btn-wrapper">
          <template v-if="needApprove">
            <Buttons v-if="approveLoading" class="dialogBtn">
              {{ $t('earn.dialog.loading') }}
            </Buttons>
            <Buttons v-else class="dialogBtn" @click.native="approveTx">
              {{ $t('earn.dialog.stakeDialog.approve') }}
            </Buttons>
          </template>

          <template v-if="!needApprove">
            <Buttons @click.native="showConfirnDialog">
              {{ $t('earn.dialog.stakeDialog.next') }}
            </Buttons>
          </template>

          <!-- <p class="buy" @click="toExchange">
            {{ $t('earn.dialog.stakeDialog.buy') }}
          </p> -->
        </div>
      </div>

      <div v-else>
        <div class="confirmPledge-content">
          <div class="arrow-wrapper" @click="showPledgeDialog">
            <img src="../../../../assets/img/arrow-left.svg" alt="arrow-left">
          </div>
          <p class="title text-center">
            {{ $t('earn.dialog.stakeDialog.confirm') }}
          </p>
          <div class="confirm-content">
            <div class="images-wrapper items-center">
              <img :src="data.img1" alt="comp">
              <img :src="data.img2" alt="comp" class="img2">
            </div>
            <h2>{{ pledgeAmount }}</h2>
            <p>{{ data.name }}</p>
            <span>{{ $t('earn.dialog.stakeDialog.willMine') }}</span>
          </div>
          <div class="price-wrapper">
            <div>
              <span>{{ $t('earn.dialog.stakeDialog.asset') }}</span>
              <div>
                <div class="images-wrapper">
                  <img :src="data.img1" width="14" alt="comp">
                  <img :src="data.img2" width="14" alt="comp" class="img2">
                </div>
                <p>{{ data.name }}</p>
              </div>
            </div>
            <div>
              <span>{{ $t('earn.dialog.stakeDialog.sharePool') }}</span>
              <p>{{ increaseRate }}</p>
            </div>
            <div>
              <span>Fee</span>
              <p>${{ fee }}</p>
            </div>
          </div>

          <Buttons v-if="sendLoading === false" @click.native="confirmSendTx">
            {{ $t('earn.dialog.stakeDialog.confirm') }}
          </Buttons>

          <Buttons v-else>
            {{ $t('earn.dialog.loading') }}
          </Buttons>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script src="./index.js">
</script>

<style lang="less" scoped>
.pledge-modal {
  // width: 500px;
  // height: 573px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .pledge-content {
    .title {
      height: 28px;
      font-size: 24px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 28px;
      margin-bottom: 24px;
    }
    .pledge-wrapper {
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
      .pledge-wrapper {
        width: 100%;
        height: 72px;
        background: #f7f8f9;
        border-radius: 6px;
        position: relative;
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
          caret-color: #FF41A1;
          &:focus {
            border: 1px solid #FF41A1;
            border-radius: 4px;
          }
        }
        .amount-input-error {
          &:focus {
            border: 1px solid #ff3c00;
            border-radius: 4px;
          }
        }
      }

      .percentage {
        margin-top: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
          cursor: pointer;
          width: 23%;
          height: 36px;
          border-radius: 6px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          font-size: 14px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #828489;
          line-height: 36px;
          text-align: center;
        }
        :hover {
          border-color: #FF41A1;
          color: #FF41A1;
        }
      }
    }
    .price-wrapper {
      margin-top: 30px;
      .price-item {
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .sharePool {
          color: #00d075;
        }
      }
      span {
        height: 14px;
        font-size: 12px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #828489;
        line-height: 14px;
      }
      p {
        height: 14px;
        font-size: 12px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 14px;
        // margin-bottom: 8px;
      }
    }
    .btn-wrapper {
      margin-top: 16px;
      .button-wrapper {
        height: 48px;
      }
      .buy {
        cursor: pointer;
        margin-top: 24px;
        text-align: center;
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #FF41A1;
      }
    }
  }

  .confirmPledge-content {
    padding: 16px 28px;
    position: relative;
    .arrow-wrapper {
      cursor: pointer;
      position: absolute;
      left: 24px;
      top: 0;
    }
    .title {
      height: 28px;
      font-size: 24px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 28px;
      margin-bottom: 40px;
    }

    .confirm-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      div {
        width: 60px;
        height: 48px;
        position: relative;
        img {
          max-width: 48px;
          position: absolute;
          left: -12px;
          top: 0;
        }
        .img2 {
          left: 12px;
          top: 0;
        }
      }
      h2 {
        height: 47px;
        font-size: 40px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 47px;
        margin: 8px 0;
      }
      p {
        height: 19px;
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 19px;
      }
      span {
        height: 32px;
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #828489;
        line-height: 16px;
        text-align: center;
        margin-top: 8px;
      }
    }

    .price-wrapper {
      margin-top: 56px;
      div {
        display: flex;
        justify-content: space-between;
        .images-wrapper {
          width: 22px;
          height: 14px;
          position: relative;
          margin-right: 8px;
          img {
            max-width: 14px;
            position: absolute;
            left: 0;
            top: 0;
          }
          .img2 {
            left: 6px;
            top: 0;
            z-index: 3;
          }
        }
      }

      span {
        height: 14px;
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #828489;
        line-height: 16px;
      }
      p {
        height: 14px;
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 16px;
        margin-bottom: 16px;
      }
    }

    .button-wrapper {
      margin-top: 24px;
      height: 48px;
    }
  }
}
</style>