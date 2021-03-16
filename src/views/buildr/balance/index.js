import { mapState, mapActions } from "vuex";
import event from '@/common/js/event';
import { collateralPools } from '@//contactLogic/buildr/balance';
import { fetchCollateralIndicators, fetchCurrencyPrice } from '@/contactLogic/buildr/create';
import { fetchPledgeNumber } from '@/contactLogic/buildr/balance';
import BigNumber from "bignumber.js";

export default {
  name: 'balance',
  data() {
    return {
      collateralPools,
      poolsData: [],
      BigNumber,
    };
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
  },
  mounted() {
    //txsuccess
    event.$on('txsuccess',()=>{
      this.loadData();
    });
  },
  methods: {
    ...mapActions('buildr', ['setPoolsData']),
    getParmas(item) {
      return {
        tokenName: item.token,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
      };
    },
    getLiquidationPrice(poolData){
      const { liquidationRatio, pledgeNumber, currentDebt } = poolData;
      const liquRatio = BigNumber(liquidationRatio).isZero() ? 0 : BigNumber(1).div(liquidationRatio);
      return BigNumber(pledgeNumber).isZero() ? 0 : BigNumber(currentDebt).times(liquRatio).div(pledgeNumber).toFixed(6);
    },
    loadData() {
      collateralPools.forEach(async (item) => {
        const params = this.getParmas(item);
        const { unlockedCollateral, targetRatio, collateralisationRatio, currentDebt, maxMintable,
          liquidationRatio, feeRate } = await fetchCollateralIndicators(params);
        const { pledgeNumber } = await fetchPledgeNumber(params);
        const { currencyPrice } = await fetchCurrencyPrice(params);

        const itemData = {
          tokenName: item.token,
          tokenTitle: item.title,
          unlockedCollateral,
          targetRatio,
          collateralisationRatio,
          currentDebt,
          maxMintable,
          liquidationRatio,
          feeRate,
          pledgeNumber,
          currencyPrice,
        };
        this.poolsData = this.poolsData.concat(itemData);
      });
    },
    openJoinDialog(poolData) {
      this.$refs.tokenJoin.open(poolData);
    },
    openMintDialog(poolData) {
      this.$refs.tokenMint.open(poolData);
    },
    openBurnDialog(poolData) {
      this.$refs.tokenBurn.open(poolData);
    },
    openExitDialog(poolData) {
      this.$refs.tokenExit.open(poolData);
    },
    sendtx(tx) {
      this.$refs.haveSendtx.open(tx.base);
      event.$emit('sendtx',[tx.response, {
        okinfo: tx.base+"成功",
        failinfo: tx.base+'失败'
      }]);
    }
  },
  watch: {
    isReady(value) {
      if (value) {
        this.loadData();
      }
    },
    poolsData(nv) {
      this.poolsData = nv;
      this.setPoolsData(nv);
    }
  },
  components: {
    JoinDialog: () => import('./dialog/join/index.vue'),
    MintDialog: () => import('./dialog/mint/index.vue'),
    BurnDialog: () => import('./dialog/burn/index.vue'),
    ExitDialog: () => import('./dialog/exit/index.vue'),
    haveSendDialog: () => import("@/components/basic/haveSendDialog.vue"),
  },
  created() {
    if(this.isReady) {
      this.loadData();
    }
  }
};