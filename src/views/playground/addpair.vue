<template>
  <div>
    添加交易对
    <Select v-model="tokenA" style="width: 200px">
      <Option v-for="item in tokenList" :key="item.symbol" :value="item.symbol">
        name: {{ item.name }} ,symbol:{{ item.symbol }}
      </Option>
    </Select>

    <div>
      <input v-model="tokenAAmount">
      <button @click="approveA">
        授权 {{ tokenA }}<button />
      </button>
    </div>
    <Select v-model="tokenB" style="width: 200px">
      <Option v-for="item in tokenList" :key="item.symbol" :value="item.symbol">
        name: {{ item.name }} ,symbol:{{ item.symbol }}
      </Option>
    </Select>
    <div>
      <input v-model="tokenBAmount">
      <button @click="approveB">
        授权 {{ tokenB }}<button />
      </button>
    </div>
    <div>fee:{{ fee }}</div>
    <div>
      <button @click="showConfirmInput">
        拼接参数
      </button>
    </div>
    <br>
    <div>
      <button @click="sendTX">
        发送交易
      </button>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getTokenList } from "@/contactLogic/readpairpool.js";
import { TokenAmount } from "@webfans/uniswapsdk";
import getChainCoinInfo from "@/constants/networkCoinconfig.js";

import {
  readpariInfoNuminfo,
  calculationLiquidity,
  checkApprove,
  buildAddliquidityParam,
  addliquidityGas,
  sendaddliquidity,
} from "@/contactLogic/readpairpool.js";

import {
  getTokenImg,
  readSwapBalance,
  getToken,
} from "@/contactLogic/readbalance.js";

import Web3 from "web3";
import { ROUTER_ADDRESS } from '@/constants/index.js';

import { useTokenApprove } from '@/contacthelp/Approve.js';


export default {
  data() {
    return {
      tokenList: [],
      tokenA: "",
      tokenB: "",
      tokenAAmount: "",
      tokenBAmount: "",
      parameters: [],
      fee: "",
      btnloading: false,
    };
  },
  methods: {
    getTokens() {
      console.log("---");
      const chainID = this.ethChainID;
      const account = this.ethAddress;
      const library = this.ethersprovider;
      return getTokenList(chainID);
    },
    async showConfirmInput() {
      //构造参数计算手续费

      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;

      const TokenA = getToken(this.$data.tokenA, chainID);
      const TokenB = getToken(this.$data.tokenB, chainID);

      const numa = this.$data.tokenAAmount;
      const numb = this.$data.tokenBAmount;

      const coinATokenAmount = new TokenAmount(
        TokenA,
        Web3.utils.toWei(numa, "ether")
      );

      const coinBTokenAmount = new TokenAmount(
        TokenB,
        Web3.utils.toWei(numb, "ether")
      );

      let ethamount;
      const coinInfo = getChainCoinInfo(chainID);
      this.$data.ethamount = "";
      if (this.$data.tokenA == coinInfo.coinName) {
        ethamount = Web3.utils.toWei(numa, "ether");
        this.$data.ethamount = ethamount;
      } else {
        ethamount = Web3.utils.toWei(numb, "ether");
        this.$data.ethamount = ethamount;
      }

      this.$data.btnloading = true;
      try {
        const parameters = await buildAddliquidityParam(
          coinATokenAmount,
          coinBTokenAmount,
          account,
          chainID
        );
        console.log(parameters);
        this.$data.parameters = parameters;

        const fee = await addliquidityGas(
          chainID,
          library,
          account,
          parameters,
          ethamount
        );

        console.log(fee);

        this.$data.fee = fee;
        this.isShowInput = false;
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          title: this.$t("notice.swapNotice.n5"),
        });
      }
      this.$data.btnloading = false;
    },
    async sendTX() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;

      const parameters = this.$data.parameters;

      // if (this.checkAmount()) {
      //   return;
      // }

      this.$data.btnloading = true;
      try {
        const tx = await sendaddliquidity(
          chainID,
          library,
          account,
          parameters,
          this.$data.ethamount
        );

        const baseTip = `${this.$t("swapConfirm.add")} ${
          this.$data.LiquidityInfo.liquidityMinted
        } ${this.$data.tokenA.symbol}/${this.$data.tokenB.symbol} LP `;
        this.$refs.haveSendtx.open(baseTip);
        event.$emit("sendtx", [
          tx,
          {
            okinfo: baseTip + this.$t("swapConfirm.success"),
            failinfo: baseTip + this.$t("swapConfirm.fail"),
          },
        ]);
        this.$data.openInputDialog = false;
      } catch (error) {
        this.$Notice.error({
          title: this.$t("notice.swapNotice.n3"),
        });
      }
      this.$data.btnloading = false;
    },
    async approveA() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      const TokenA = getToken(this.$data.tokenA, chainID);

      const numa = this.$data.tokenAAmount;
      const amount = Web3.utils.toWei(numa);

      

      const spender = ROUTER_ADDRESS;
      this.$data.btnloading = true;

      const transaction = await useTokenApprove(library, account, TokenA, spender, amount);
      console.log(transaction);
      if (transaction) {
        const waitdata = await transaction.wait([1]);
        console.log(waitdata);
        this.$data.tokenAnotNeed = true;
      } else {
        //取消授权
        //需要提示
        this.$Notice.error({
          title: this.$t('notice.swapNotice.n4'),
        });
      }
      this.$data.btnloading = false;
    },
    async approveB() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;

      // if (this.checkAmount()) {
      //   return;
      // }

      const TokenB = getToken(this.$data.tokenB, chainID);

      const numb = this.$data.tokenBAmount;

      const amount = Web3.utils.toWei(numb);

      const spender = ROUTER_ADDRESS;

      this.$data.btnloading = true;

      const transaction = await useTokenApprove(library, account, TokenB, spender, amount);
      console.log(transaction);
      
    },
  },
  watch: {
    ethChainID: function () {
      this.$data.tokenList = this.getTokens();
    },
  },
  computed: {
    ...mapState(["ethAddress", "ethChainID", "web3", "ethersprovider"]),
  },
};
</script>
<style lang="less" scoped>
input{
  border: 1px solid salmon;
}
</style>

