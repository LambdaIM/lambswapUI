import { mapState } from "vuex";
import ScInput from '../../../components/ScInput.vue';
import { fetchBalanaceChange } from '@/contactLogic/buildr/balance';

export default {
  inject: ['reload'],
  data() {
    return {
      step: 1,
      isOpen: false,
      coinAmount: 0,  // 当前抵押资产的数量
      currMaxMintable: 0,   // 当前获取的授信scUSD额度
      currPledgeRatio: 0,   // 当前抵押率
      currLiquidationPrice: 0, // 当前清算价格
      currFee: 0,
      parentData: {},  // 父组件的数据
    };
  },
  components: {
    ScInput
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress'])
  },
  methods: {
    // 打开弹窗
    open() {
      this.parentData = this.$parent.$data;
      this.isOpen = true;
      this.step = 1;
      this.coinAmount = 0;
      this.currMaxMintable = 0;
      this.currPledgeRatio = 0;
      this.currLiquidationPrice = 0;
      this.currFee = 0
    },
    onMintClick() {
      this.isOpen = false;
      this.$parent.openMintDialog();
    },
    onChangeValue(value) {
      const { pledgeNumber, existingDebt, liquidationRatio, feeRate } = this.parentData;
      // 销毁的scUSD
      this.coinAmount = value;
      // 计算手续费
      this.currFee = this.coinAmount * feeRate;
      // 总负债
      const newDebt = existingDebt - (this.coinAmount - this.currFee);
      // 当前抵押率 = 总资产 / 总授信
      this.currPledgeRatio = pledgeNumber / newDebt;
      // 清算价格：
      this.currLiquidationPrice = pledgeNumber ? liquidationRatio * newDebt / pledgeNumber : 0;
    },
    onNextClick() {
      this.step = 2;
    },
    async onBurnClick() {
      const params = {
        type: 'burn',
        tokenName: this.parentData.currency,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
        coinAmount: this.coinAmount,
      }
      await fetchBalanaceChange(params);
      this.isOpen = false;
    }
  },
};
