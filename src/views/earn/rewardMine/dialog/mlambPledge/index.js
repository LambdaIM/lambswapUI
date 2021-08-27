import { mapState } from 'vuex';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });
import { debounce } from 'debounce';
import { TokenAmount, Token } from '@webfans/uniswapsdk';
import { useNeedApproveInput } from '@/contacthelp/useNeedApprove.js';
import { useApproveCallback } from '@/contacthelp/useApproveCallback.js';
import token from '@/constants/token.json';
import mLAMBAbi from '@/constants/abis/erc20mLAMB.json';
import Web3 from 'web3';
import { useSushiBarEnter } from '../../../utils/helpUtils/mineUtilFunc.js';
import event from '@/common/js/event';
export default {
    components: {
        Buttons: () =>
            import ('@/components/basic/buttons'),
    },
    data() {
        return {
            openPledgeDialog: false,
            pledgeAmount: '',
            data: {},
            sendLoading: false,
            mLAMBBalance: 0,
            needApprove: false,
            tokenObj: {},
            approveLoading: false
        };
    },
    computed: {
        ...mapState(['ethersprovider', 'ethAddress', 'ethChainID', 'web3']),
    },
    methods: {
        // 存入mLAMB
        async depositMLAMB() {
            if (!this.checkData()) {
                return false;
            }
            this.sendLoading = true;
            try {
                const library = this.ethersprovider;
                const account = this.ethAddress;

                const chainId = this.ethChainID;
                const address = this.data && this.data.address;
                const decimals = this.data && this.data.decimals;
                const symbol = this.data && this.data.symbol;

                const tokenData = new Token(chainId, address, decimals, symbol);

                const amount = Web3.utils.toWei(this.pledgeAmount.toString(), 'ether');
                const result = await useSushiBarEnter(library, account, tokenData, amount);
                if (result.hash) {
                    event.$emit('sendSuccess');
                    event.$emit('sendtx', [
                        result,
                        {
                            okinfo: `存入 ${this.pledgeAmount} mLAMB ${this.$t('notice.n42')}`,
                            failinfo: `存入 ${this.pledgeAmount} mLAMB ${this.$t('notice.n43')}`,
                        },
                    ]);
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.openPledgeDialog = false;
                this.sendLoading = false;
            }
        },

        open(data) {
            console.log({ data });
            this.data = {};
            this.data = data;
            this.pledgeAmount = '';
            this.getMlambBalance();
            this.openPledgeDialog = true;
        },

        // 获取mlamb余额
        async getMlambBalance() {
            const [mLAMBItem] = token.tokens.filter(item => item.name === 'mLAMB' && item.chainId === this.ethChainID);
            const contractAddress = mLAMBItem.address;
            const abi = mLAMBAbi;
            const contract = new this.web3.eth.Contract(abi, contractAddress);
            try {
                const res = await contract.methods
                    .balanceOf(this.ethAddress)
                    .call();
                let result = new BigNumber(res).div("1e18").decimalPlaces(6).toNumber();
                if (isNaN(result)) {
                    result = 0;
                }
                this.mLAMBBalance = result;
            } catch (error) {
                console.log(error);
            }
        },

        // 检查授权
        checkApprove: debounce(async function() {
            try {
                const chainId = this.ethChainID;
                const address = this.data && this.data.data.rewardTokenAddress;
                const decimals = this.data && this.data.decimals;
                const symbol = this.data && this.data.symbol;
                const tokenData = new Token(chainId, address, decimals, symbol);

                // 需要将数据转为字符串格式
                const amount = this.pledgeAmount.toString();

                // 批准mlamb的授权
                const amountToApprove = new TokenAmount(tokenData, Web3.utils.toWei(amount, 'ether'));

                // xmlamb地址
                this.tokenObj.dataAddress = this.data && this.data.address;
                this.tokenObj.amountToApprove = amountToApprove;

                // 检查授权
                this.needApprove = await useNeedApproveInput(
                    this.ethAddress,
                    this.ethersprovider,
                    amountToApprove,
                    this.tokenObj.dataAddress
                );
                console.log(this.needApprove);
            } catch (error) {
                console.log(error);
            }
        }, 800),

        // 授权操作
        async approveTx() {
            if (!this.checkData()) {
                return false;
            }
            try {
                this.approveLoading = true;
                const result = await useApproveCallback(
                    this.ethAddress,
                    this.ethersprovider,
                    this.tokenObj.amountToApprove,
                    this.tokenObj.dataAddress
                );
                if (result) {
                    const wait = await result.response.wait([1]);
                    if (wait) {
                        this.needApprove = false;
                        this.approveLoading = false;
                    }
                }
            } catch (error) {
                this.approveLoading = false;
                console.log(error);
            }
        },

        percentage(val) {
            const balance = new BigNumber(this.mLAMBBalance);
            const percent = new BigNumber(val);
            this.pledgeAmount = balance.multipliedBy(percent).decimalPlaces(6).toNumber();
        },


        // 限制Input输入小数点的长度
        handleInput(e) {
            const stringValue = e.target.value.toString();
            this.pledgeAmount = stringValue.replace(/\D*(\d*)(\.?)(\d{0,6})\d*/, '$1$2$3');
        },

        // 检验数据是否合法
        checkData() {
            const balance = this.mLAMBBalance;
            const bigBalance = new BigNumber(balance);
            const amount = new BigNumber(this.pledgeAmount);
            if (this.pledgeAmount === '') {
                this.$Notice.warning({
                    title: this.$t('notice.n'),
                    desc: this.$t('notice.n30'),
                });
                return false;
            }
            if (parseFloat(this.pledgeAmount) <= 0) {
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

    },
    watch: {
        pledgeAmount() {
            this.checkApprove();
        }
    }
};