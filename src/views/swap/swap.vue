<template>
  <div class="exchange">
    <div v-if="!isMobile" class="content-wrapper flex justify-between pc-exchange">
      <div class="exchanges-wrapper">
        <div class="list-wrapper">
          <div class="list-title flex justify-between">
            <span class="pair">{{ $t('swap.Pair') }}</span>
            <span class="price">{{ $t('swap.Price') }}</span>
            <div class="change-title flex">
              <span>{{ $t('swap.Change') }}</span>
              <Tooltip placement="top" :content="$t('swap.ChangeTip')">
                <img src="../../assets/img/problem-16.png">
              </Tooltip>
            </div>
          </div>
          <div v-if="pairlistloading" class="demo-spin-container">
            <loading />
          </div>
          <div
            v-for="item in pairlist"
            v-else
            :key="item.pairName"
            :class="selectPairName == item.pairName ? 'list-item active' : 'list-item'"
            @click="selectPair(item)"
          >
            <div>
              <img :src="getTokenImg(item.listSymbol)">
              <p>{{ item.pairName }}</p>
            </div>
            <p class="price">
              {{ item.price | formatNormalValue }}
              <span
                v-if="(item.pairName == 'GOAT/LAMB' || item.pairName == 'HGT/LAMB') && LAMB_USDT != ''"
                class="goatprice"
              >
                ${{ (LAMB_USDT * item.price) | formatNormal3Value }}
              </span>
            </p>
            <p v-if="item.change" :class="item.change == '+' ? 'change' : 'change decline'">
              {{ item.change }} {{ item.prisechange | formatRate }}
            </p>
            <p v-else :class="item.change == '+' ? 'change' : 'change decline'">
              --
            </p>
          </div>
        </div>
      </div>
      <div class="swap-wrapper">
        <div class="From-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('swap.fromToken') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('swap.balance') }}</span>
              <span v-if="inputcurrency">{{ inBalance | format1e18Value }} {{ inputcurrency.symbol }}</span>
            </div>
          </div>
          <div class="input-wrapper flex">
            <input
              v-model="inputAmount"
              type="text"
              :class="inputnotice == '' ? 'amount-input' : 'amount-input  amount-input-error'"
              @keyup="inputChange"
            >
            <div v-if="inputcurrency" class="flex unit">
              <img :src="getTokenImg(inputcurrency.symbol)">
              <p>
                {{ inputcurrency.symbol }}
              </p>
            </div>
          </div>
          <div class="result-wrapper">
            <!-- <span class="text-secondary mr-2">1 tLAMB ≈ 12.2343 USD</span> -->
          </div>
        </div>

        <div v-if="inputnotice" class="notice-wrapper">
          <div class="notice-content">
            <img src="../../assets/img/notice-red.png">
            <p>{{ inputnotice }}</p>
          </div>
        </div>

        <div v-if="isArrow" class="arrow-wrapper" @click="Changeparameters">
          <img src="../../assets/img/exchange-32.svg">
        </div>
        <div v-else class="arrow-wrapper arrow-active" @click="Changeparameters">
          <img src="../../assets/img/exchange-32-w.svg">
        </div>

        <div class="To-wrapper From-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('swap.toToken') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('swap.balance') }}</span>
              <span v-if="outputcurrency">{{ outBalance | format1e18Value }} {{ outputcurrency.symbol }}</span>
            </div>
          </div>
          <div class="input-wrapper flex">
            <input v-model="coinBValue" type="text" class="amount-input" readonly>
            <div v-if="outputcurrency" class="flex unit">
              <img :src="getTokenImg(outputcurrency.symbol)">
              <p>
                {{ outputcurrency.symbol }}
              </p>
            </div>
          </div>
        </div>

        <div class="details-wrapper">
          <div v-if="needApprove == false" class="details-items">
            <p>{{ $t('swap.ethgasfree') }}</p>
            <span>
              {{ gasfee | formatBalanceNumber }} {{ chainTokenName }} ≈ $
              {{ (chainTokenPrice * gasfee) | formatBalanceNumber }}
            </span>
          </div>
          <div class="details-items">
            <p>{{ $t('swap.PriceImpact') }}</p>
            <span>{{ PriceImpact }}</span>
          </div>
          <div class="details-items">
            <p>{{ $t('swap.Minimumreceived') }}</p>
            <span v-if="outputcurrency">{{ Minimumreceived }} {{ outputcurrency.symbol }}</span>
          </div>
        </div>
        <div v-if="ethAddress">
          <Buttons v-if="btnloading" border-radius="24px">
            Loading...
          </Buttons>
          <div v-else>
            <Buttons v-if="PriceImpactGreater == true" border-radius="24px">
              {{ $t('swap.PriceImpactError') }}
            </Buttons>
            <div v-else>
              <Buttons v-if="needApprove == false" border-radius="24px" @click.native="openconfirmtDialog">
                {{ $t('swap.swapBtn') }}
              </Buttons>
              <div v-else>
                <Buttons class="smallbtn" border-radius="24px" @click.native="makeApprove">
                  {{ $t('swap.approve') }}
                </Buttons>
                <Buttons border-radius="24px" class="smallbtn disableBtn">
                  {{ $t('swap.swapBtn') }}
                </Buttons>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <Buttons class="disableBtn">
            {{ $t('swap.swapBtn') }}
          </Buttons>
        </div>
      </div>
    </div>

    <div v-else class="m-exchange">
      <div class="menu-wrapper flex justify-items-start items-center" @click="openDraw">
        <img class="mr-3" src="../../assets/img/menu.svg" alt="menu">
        <span>{{ selectPairName }}</span>
      </div>

      <!-- swap -->
      <div class="content-wrapper m-swap-wrapper">
        <div class="left-right-item">
          <span class="left">{{ $t('swap.balance') }}</span>

          <div v-if="outputcurrency" class="right">
            <span class="m-balance">{{ $t('swap.balance') }}</span>
            <span v-if="inputcurrency" class="m-balance-value">
              {{ inBalance | format1e18Value }} {{ inputcurrency.symbol }}
            </span>
          </div>
        </div>

        <div class="input-wrapper">
          <input
            v-model="inputAmount"
            type="text"
            :class="inputnotice == '' ? 'amount-input' : 'amount-input  amount-input-error'"
            @keyup="inputChange"
          >
          <div v-if="inputcurrency" class="unit">
            <img :src="getTokenImg(inputcurrency.symbol)">
            <p>
              {{ inputcurrency.symbol }}
            </p>
          </div>
        </div>

        <div v-if="inputnotice" class="notice-wrapper">
          <div class="notice-content">
            <img src="../../assets/img/notice-red.png">
            <p>{{ inputnotice }}</p>
          </div>
        </div>

        <div v-if="isArrow" class="arrow-wrapper" @click="Changeparameters">
          <img src="../../assets/img/exchange-32.svg">
        </div>
        <div v-else class="arrow-wrapper arrow-active" @click="Changeparameters">
          <img src="../../assets/img/exchange-32-w.svg">
        </div>

        <div class="left-right-item">
          <span class="left">{{ $t('swap.toToken') }}</span>
          <div v-if="outputcurrency" class="right">
            <span class="m-balance">{{ $t('swap.balance') }}</span>
            <span class="m-balance-value">{{ outBalance | format1e18Value }} {{ outputcurrency.symbol }}</span>
          </div>
        </div>

        <div class="input-wrapper">
          <input v-model="coinBValue" type="text" class="amount-input" readonly>
          <div v-if="outputcurrency" class="unit">
            <img :src="getTokenImg(outputcurrency.symbol)">
            <p>
              {{ outputcurrency.symbol }}
            </p>
          </div>
        </div>

        <div class="m-detail-wrapper">
          <div v-if="needApprove == false" class="detail-item">
            <p>{{ $t('swap.ethgasfree') }}</p>
            <span>
              {{ gasfee | formatBalanceNumber }} {{ chainTokenName }} ≈ $
              {{ (chainTokenPrice * gasfee) | formatBalanceNumber }}
            </span>
          </div>
          <div class="detail-item">
            <p>{{ $t('swap.PriceImpact') }}</p>
            <span>{{ PriceImpact }}</span>
          </div>
          <div class="detail-item">
            <p>{{ $t('swap.Minimumreceived') }}</p>
            <span v-if="outputcurrency">{{ Minimumreceived }} {{ outputcurrency.symbol }}</span>
          </div>
        </div>

        <div class="m-btn-wrapper">
          <template v-if="ethAddress">
            <button v-if="btnloading" class="m-swap-btn">
              Loading...
            </button>

            <template v-else>
              <button v-if="PriceImpactGreater == true" class="m-swap-btn">
                {{ $t('swap.PriceImpactError') }}
              </button>
              <div v-else>
                <button v-if="needApprove == false" class="m-swap-btn" @click="openconfirmtDialog">
                  {{ $t('swap.swapBtn') }}
                </button>
                <div v-else>
                  <button class="m-swap-btn smallBtn" @click="makeApprove">
                    {{ $t('swap.approve') }}
                  </button>
                  <button class="m-swap-btn smallBtn disableBtn">
                    {{ $t('swap.swapBtn') }}
                  </button>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <button class="disableBtn">
              {{ $t('swap.swapBtn') }}
            </button>
          </template>
        </div>
      </div>
    </div>

    <confirmtDialog ref="confirm" />

    <Drawer v-model="openMobileList" :transfer="false" width="340" placement="left" :closable="true">
      <h2 slot="header">
        市场
      </h2>
      <div class="m-pair-content">
        <Table :columns="pairColumns" :data="drawPairData" @on-row-click="selectPair">
          <template slot="pair" slot-scope="{ row }">
            <div class="pairItem tableItem">
              <img :src="getTokenImg(row.listSymbol)">
              <p>{{ row.pairName }}</p>
            </div>
          </template>

          <template slot="price" slot-scope="{ row }">
            <div class="tableItem">
              <p>{{ row.price | formatNormalValue }}</p>

              <p
                v-if="(row.pairName == 'GOAT/LAMB' || row.pairName == 'HGT/LAMB') && LAMB_USDT != ''"
                class="goatprice"
              >
                ${{ (LAMB_USDT * row.price) | formatNormal3Value }}
              </p>
            </div>
          </template>

          <template slot="rate" slot-scope="{ row }">
            <div class="tableItem">
              <span v-if="row.change === '-'" class="text-error">
                {{ row.change }}{{ row.prisechange | formatRate }}
              </span>
              <span v-if="row.change === '+'" class="text-success">
                {{ row.change }}{{ row.prisechange | formatRate }}
              </span>
            </div>
          </template>
        </Table>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { TokenAmount } from '@webfans/uniswapsdk';

import { INITIAL_ALLOWED_SLIPPAGE, ROUTER_ADDRESS } from '@/constants/index.js';

import { readpairpool, readpairpoolPrice } from '@/contactLogic/readpairpool.js';
import { readSwapBalance, getToken, getTokenImg } from '@/contactLogic/readbalance.js';

import { tradeCalculate, SwapGas } from '@/contactLogic/swaplogoc.js';
import Web3 from 'web3';

import { useNeedApprove } from '@/contacthelp/useNeedApprove.js';
import { useTokenApprove } from '@/contacthelp/Approve.js';

import event from '@/common/js/event';

const debounce = require('debounce');

const BigNumber = require('bignumber.js');

import _ from 'underscore';

BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });

let nowTrade;

export default {
  data() {
    return {
      isArrow: true,
      pairlist: [],
      selectPairName: '',
      inputcurrency: null,
      outputcurrency: null,
      inputAmount: '',
      inBalance: '',
      outBalance: '',
      selectPairOBJ: null,
      PriceImpact: '',
      PriceImpactGreater: false,
      coinBValue: '',
      Minimumreceived: '',
      btnloading: false,
      needApprove: false,
      gasfee: '',
      pairlistloading: false,
      inputnotice: '',
      LAMB_USDT: '',
      openMobileList: false,
      drawPairData: [],
    };
  },
  components: {
    Buttons: () => import('@/components/basic/buttons'),
    confirmtDialog: () => import('@/views/swap/dialog/confirmDialog'),
    loading: () => import('@/components/basic/loading.vue'),
  },
  methods: {
    openDraw() {
      this.openMobileList = true;
      this.drawPairData = this.pairlist;
    },
    getTokenImg(tokensymbol) {
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol, chainID);
    },
    exchange() {
      this.isArrow = !this.isArrow;
    },
    async readList() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      // const account = this.ethAddress;
      this.pairlistloading = true;
      const data = await readpairpool(chainID, library);
      this.pairlistloading = false;

      // console.log({ data });
      this.pairlist = data || [];
      // const _this = this;
      this.pairlist.forEach((element) => {
        // console.log(element);
        if (element.pairName == 'LAMB/USDT') {
          this.LAMB_USDT = element.price;
        }
      });

      if (data && data[0] && this.selectPairOBJ === null) {
        setTimeout(() => {
          this.selectPair(data[0]);
        }, 1);
      }

      setTimeout(async () => {
        const data = await readpairpoolPrice(chainID, library, this.pairlist);
        console.log(data);
        this.pairlist = [];
        this.pairlist = data;
      }, 1);
    },
    async selectPair(pair) {
      console.log(pair);

      this.selectPairOBJ = pair;

      this.selectPairName = pair.pairName;

      this.inputcurrency = pair.Pair.tokenAmounts[1].currency;
      this.outputcurrency = pair.Pair.tokenAmounts[0].currency;
      this.isArrow = true;
      this.openMobileList = false;
      this.showparameters();
    },
    Changeparameters() {
      console.log('Changeparameters');
      if (this.selectPairOBJ) {
        this.isArrow = !this.isArrow;
        this.inputcurrency = this.selectPairOBJ.Pair.tokenAmounts[this.isArrow ? 1 : 0].currency;
        this.outputcurrency = this.selectPairOBJ.Pair.tokenAmounts[this.isArrow ? 0 : 1].currency;
        this.showparameters();
        this.clearData();
      }
    },
    async showparameters() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      if (account === '') {
        return;
      }
      this.clearData();

      const TokenA = getToken(this.inputcurrency.symbol, chainID);
      const TokenB = getToken(this.outputcurrency.symbol, chainID);

      const data = await readSwapBalance(chainID, library, account, TokenA, TokenB);

      this.inBalance = data.TokenAamount.toString();
      this.outBalance = data.TokenBamount.toString();
    },
    inputChange: debounce(async function () {
      //debounce(
      console.log(this.inputAmount);
      this.inputnotice = '';
      if (this.inputcheckup()) {
        try {
          this.btnloading = true;
          await this.calculationOutPut(this.inputAmount);
        } catch (error) {
          console.log(error);
        } finally {
          this.btnloading = false;
        }
      }
    }, 1000),
    inputcheckup() {
      try {
        const num = parseFloat(this.inputAmount);
        if (isNaN(num)) {
          this.inputnotice = this.$t('swap.enterthequantity');
          nowTrade = null;
          return false;
        }
        const inamount = new BigNumber(Web3.utils.toWei(this.inputAmount, 'ether'));
        if (inamount.isGreaterThan(this.inBalance) || inamount.isLessThanOrEqualTo('0')) {
          this.inputnotice = this.$t('swap.actions.Amountexceedsbalance');
          nowTrade = null;
          return false;
        }
      } catch (error) {
        console.log(error);
        this.inputnotice = this.$t('swap.actions.needNumber');
        nowTrade = null;
      }

      return true;
    },
    clearData() {
      this.inputAmount = '';
      this.coinBValue = '';
      nowTrade = null;
      this.inputnotice = '';
    },
    async calculationOutPut(num) {
      const chainID = this.ethChainID;
      const TokenA = getToken(this.inputcurrency.symbol, chainID);
      const TokenB = getToken(this.outputcurrency.symbol, chainID);

      const inputAmount = new TokenAmount(TokenA, Web3.utils.toWei(num, 'ether'));

      const outToken = new TokenAmount(TokenB, Web3.utils.toWei('0', 'ether'));

      console.log(inputAmount, outToken);

      const result = await tradeCalculate(inputAmount, outToken);

      console.log(result);

      this.PriceImpact = result.PriceImpact;
      this.PriceImpactGreater = result.PriceImpactGreater;
      this.coinBValue = result.coinBValue.toSignificant(6);
      this.Minimumreceived = result.Minimumreceived.toSignificant(6);
      nowTrade = result.trade;

      setTimeout(() => {
        this.getGasFee(result.trade);
      }, 100);
    },
    async getGasFee(trade) {
      const library = this.ethersprovider;
      const account = this.ethAddress;
      const ChainId = this.ethChainID;

      console.log(trade);
      const needApprove = await useNeedApprove(account, library, trade, INITIAL_ALLOWED_SLIPPAGE);
      this.needApprove = needApprove;

      console.log(needApprove);
      if (needApprove === false) {
        const gasfee = await SwapGas(library, account, ChainId, trade);
        console.log('gasfee', gasfee);
        this.gasfee = gasfee;
      }
    },
    async makeApprove() {
      console.log('makeApprove');

      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      const num = this.inputAmount;

      const TokenA = getToken(this.inputcurrency.symbol, chainID);
      const amount = Web3.utils.toWei(num, 'ether');
      const spender = ROUTER_ADDRESS;

      try {
        this.btnloading = true;
        const transaction = await useTokenApprove(library, account, TokenA, spender, amount);
        console.log(transaction);
        if (transaction) {
          const waitdata = await transaction.wait([1]);
          console.log(waitdata);
          this.needApprove = false;
          this.calculationOutPut(num);
        } else {
          //取消授权
          //需要提示
          this.$Notice.error({
            title: this.$t('swap.actions.approvecancel'),
          });
        }
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          title: this.$t('swap.actions.Transactionfailure'),
          desc: error.message,
        });
      } finally {
        this.btnloading = false;
      }
    },
    openconfirmtDialog() {
      if (nowTrade) {
        this.$refs.confirm.open(_.clone(this), nowTrade);
        this.clearData();
      }
    },
  },
  computed: {
    ...mapState([
      'ethChainID',
      'ethAddress',
      'web3',
      'ethersprovider',
      'chainTokenPrice',
      'chainTokenName',
      'isMobile',
    ]),
    pairColumns() {
      const columns = [
        {
          title: this.$t('swap.Pair'),
          slot: 'pair',
          minWidth: 120,
        },
        {
          title: this.$t('swap.Price'),
          slot: 'price',
          minWidth: 100,
        },
        {
          title: this.$t('swap.Change'),
          slot: 'rate',
          minWidth: 100,
        },
      ];
      return columns;
    },
  },
  async mounted() {
    if (this.ethChainID) {
      this.readList();
    }
    //txsuccess
    event.$on('txsuccess', () => {
      this.readList();
      this.showparameters();
    });
  },
  watch: {
    ethChainID: function () {
      if (this.ethChainID) {
        this.readList();
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import './media/index.less';
.content-wrapper {
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  margin-top: 16px;
  .exchanges-wrapper {
    width: 48%;
    .list-wrapper {
      width: 100%;
      .list-title {
        width: 100%;
        padding: 0px 16px 8px 16px;
        span {
          font-size: 12px;
          color: #828489;
          line-height: 14px;
        }
        .pair {
          width: 50%;
        }
        .price {
          width: 25%;
        }
        .change-title {
          width: 25%;
          img {
            margin-left: 4px;
            cursor: pointer;
            position: relative;
            :hover::after {
              content: 'fslkasfjlkasjflaksfjklasjfasfalksfjlkasjflkafj';
              display: block;
              width: 156px;
              height: 40px;
              background: rgba(14, 17, 28, 0.6);
              border-radius: 6px;
              position: absolute;
              right: 10%;
              top: 0;
            }
          }
        }
      }
      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        cursor: pointer;
        height: 56px;
        box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.06);
        padding: 16px;
        position: relative;
        div {
          display: flex;
          width: 50%;
          align-items: center;
          line-height: 32px;
          img {
            max-width: 24px;
            max-height: 24px;
            margin-right: 8px;
            p {
              height: 80px;
              font-size: 16px;
              line-height: 19px;
            }
          }
        }
        .price {
          width: 25%;
          height: 19px;
          font-size: 16px;
          line-height: 19px;
        }
        .change {
          width: 25%;
          height: 19px;
          font-size: 16px;
          color: #00d075;
          line-height: 19px;
        }
        .decline {
          color: #ff3c00;
        }
      }
      .list-item::before {
        content: '';
        height: 56px;
        width: 2px;
        background: #ff41a1;
        position: absolute;
        left: 0;
        top: 0;
        display: none;
      }
      .active {
        background: rgba(0, 88, 255, 0.04);
      }
      .active::before {
        display: block;
      }
    }
  }
  .swap-wrapper {
    width: 48%;
    margin-left: 72px;
    .swap-title {
      font-size: 20px;
      line-height: 24px;
    }
    .From-wrapper {
      .title-content {
        overflow: hidden;
        margin-bottom: 8px;
        span {
          float: left;
        }
        .balance-item {
          float: right;
          font-size: 12px;
          line-height: 14px;
        }
      }
      .input-wrapper {
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
          padding: 16px;
          caret-color: #ff41a1;
          &:focus {
            border: 1px solid #ff41a1;
            border-radius: 4px;
          }
        }
        .amount-input-error {
          &:focus {
            border: 1px solid #ff3c00;
            border-radius: 4px;
          }
        }
        .unit {
          position: absolute;
          right: 16px;
          top: 30%;
          width: 80px;
          justify-content: space-between;
          align-items: center;
          line-height: 32px;
          img {
            max-width: 24px;
            max-height: 24px;
          }
          p {
            font-size: 16px;
          }
          img {
            max-width: 24px;
          }
        }
      }
      .result-wrapper {
        margin-top: 8px;
        font-size: 12px;
        span {
          font-size: 12px;
          color: #ff41a1;
        }
      }
    }
    .notice-wrapper {
      .notice-content {
        margin: 20px 0;
        display: flex;
        align-items: center;
        padding: 9px 30px;
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
    .arrow-wrapper {
      position: relative;
      cursor: pointer;
      width: 32px;
      height: 32px;
      background: #f7f8f9;
      border-radius: 4px;
      margin: 34px auto;
      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-width: 32px;
      }
    }
    .arrow-active {
      background: #ff41a1;
    }

    .details-wrapper {
      .details-items {
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        p {
          font-size: 14px;
          color: #828489;
          line-height: 16px;
        }
        span {
          font-size: 14px;
          line-height: 16px;
          margin-left: 8px;
        }
      }
    }

    .button-wrapper {
      height: 48px;
      margin-top: 24px;
      button {
        font-size: 16px;
      }
    }
  }
  .smallbtn {
    width: 45%;
    display: inline-block;
    margin: 2.5%;
  }
}

.demo-spin-container {
  display: inline-block;
  width: 100%;
  height: 100px;
  position: relative;
}

.goatprice {
  font-size: 12px;
  color: #9fa3a7;
  display: block;
}
</style>