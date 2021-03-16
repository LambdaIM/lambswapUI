import { mapState } from 'vuex';
import ScInput from '../components/ScInput.vue';
import { collateralPools } from '@//contactLogic/buildr/balance';
import BigNumber from "bignumber.js";
import {
  fetchTokenBalance,
  fetchCollateralIndicators,
  fetchCurrencyPrice,
  fetchApprove
} from '@/contactLogic/buildr/create';


export default {
  name: 'create',
  data() {
    return {
      currencyNumber: 0, // 资产数量
      pledgeNumber: 0,   // 质押币数量
      stableNumber: 0,   // 稳定币数量
      targetRX: 0,          // 抵押率（倍数）
      liquidationRatio: 0,  // 清算抵押率
      feeRate: 0,    // 稳定费率
      debtCap: 0,    // 全球scUSD债务上限
      currencyPrice: 0,
      collateralPools: collateralPools,
      defaultPoolToken: collateralPools[0].token,
      BigNumber,
    };
  },
  components: {
    ScInput,
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress'])
  },
  methods: {
    getParmas() {
      return {
        tokenName: this.defaultPoolToken,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
      };
    },
    async getCurrencyNumber() {
      const params = this.getParmas();
      this.currencyNumber = await fetchTokenBalance(params);
    },
    async getIndicators() {
      const params = this.getParmas();
      const { targetRatio, liquidationRatio, feeRate, debtCap } = await fetchCollateralIndicators(params);

      this.targetRX = BigNumber(targetRatio).isZero() ? 0 : BigNumber(1).div(targetRatio);
      this.liquidationRatio = BigNumber(liquidationRatio).isZero() ? 0 : BigNumber(1).div(liquidationRatio);
      this.feeRate = feeRate;
      this.debtCap = debtCap;
    },
    async getCurrencyPrice() {
      const params = this.getParmas();
      const { currencyPrice } = await fetchCurrencyPrice(params);

      this.currencyPrice = currencyPrice;
    },
    onChangePledgeNumber(val) {
      this.pledgeNumber = val;
      this.stableNumber = BigNumber(val).times(this.currencyPrice).div(this.targetRX);
    },
    async onApproveClick() {
      const params = Object.assign({}, this.getParmas(), {
        pledgeNumber: this.pledgeNumber,
      });
      const result = await fetchApprove(params);
      if (result && result.hash) {
        this.$parent.onChangeNav(2);
      }
    }
  },
  watch: {
    defaultPoolToken() {
      this.getCurrencyNumber();
      this.getIndicators();
      this.getCurrencyPrice();
    }
  },
  created() {
    this.getCurrencyNumber();
    this.getIndicators();
    this.getCurrencyPrice();
  }
};