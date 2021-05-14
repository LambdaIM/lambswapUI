<template>
  <div class="content-wapper">
    <!-- <div v-if="showLoading">
      <loading />
    </div> -->
    <div v-if="!ethAddress || list.length == 0" class="noData-wapper">
      <div class="flex flex-col items-center">
        <img src="../../../assets/img/noData.png" alt="noData">
        <p>No Data</p>
      </div>
    </div>
    <div v-else class="earn-wapper">
      <Scroll :loading-text="'loading....'" :on-reach-bottom="onreachbottom" :height="400">
        <div class="list-wapper">
          <Table :loading="showLoading" :columns="getHistory" :data="list">
            <template slot="Pool" slot-scope="{ row }">
              <div class="Pool">
                <p>
                  {{ selectAddress(row.show.poolADDRESS) }}
                </p>
              </div>
            </template>
            <template slot="Action" slot-scope="{ row }">
              <div class="Action">
                <p v-if="row.method_name === 'stake'" class="action">
                  {{ $t('earn.actions.stake') }}
                </p>
                <p v-else-if="row.method_name === 'exit'" class="action">
                  {{ $t('earn.actions.exit') }}
                </p>
                <p v-else-if="row.method_name === 'getReward'" class="action">
                  {{ $t('earn.actions.getReward') }}
                </p>
                <p v-else class="action">
                  {{ row.method_name }}
                </p>
              </div>
            </template>
            <template slot="Amount" slot-scope="{ row }">
              <div v-if="row.method_name === 'exit'" class="Amount">
                <p class="amout">
                  {{ row.show.outamountA | format1e18ValueList }} {{ row.show.tokenA }}
                </p>
                <p class="amout">
                  {{ row.show.outamountB | format1e18ValueList }} {{ row.show.tokenB }}
                </p>
              </div>
              <div v-else-if="row.method_name === 'getReward'" class="Amount">
                <p class="amout">
                  {{ row.show.outamount | format1e18ValueList }} {{ row.show.tokenA }}
                </p>
              </div>
              <div v-else-if="row.method_name === 'stake'" class="Amount">
                <p class="amout">
                  {{ row.show.inamount | format1e18ValueList }} {{ row.show.tokenA }}
                </p>
              </div>

              <div v-else-if="row.method_name === 'leave'" class="Amount">
                <p class="amout">
                  {{ row.show.outamountA | format1e18ValueList }} {{ row.show.tokenA }}
                </p>
                <p class="amout">
                  {{ row.show.outamountB | format1e18ValueList }} {{ row.show.tokenB }}
                </p>
              </div>

              <div v-else-if="row.method_name === 'enter'" class="Amount">
                <p class="amout">
                  {{ row.show.outamountA | format1e18ValueList }} {{ row.show.tokenA }}
                </p>
              </div>
            </template>
            <template slot="Status" slot-scope="{ row }">
              <div class="Status">
                <p v-if="row.tx_status === 1" class="status success">
                  {{ $t('history.success') }}
                </p>
                <p v-else class="fail">
                  {{ $t('history.fail') }}
                </p>
              </div>
            </template>
          </Table>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { readPledgeHistory } from '@/contactLogic/history.js';
import tokenList from '@/constants/token.json';
import poolList from '@/constants/earnList.json';

const fullToken = tokenList.tokens.concat(poolList);
// console.log({fullToken});
export default {
  data() {
    return {
      list: [],
      pageNum: 1,
      showLoading: false,
    };
  },
  components: {
    loading: () => import('@/components/basic/loading.vue'),
  },
  methods: {
    async getreadPledgeHistory() {
      this.showLoading = true;
      try {
        const chainID = this.ethChainID;
        const account = this.ethAddress;
        const data = await readPledgeHistory(chainID, account, this.pageNum, 10);
        this.list = this.list.concat(data.data);
        console.log(this.list);
      } catch (error) {
        console.log(error);
      } finally {
        this.showLoading = false;
      }
    },
    selectAddress(val) {
      console.log({val});
      const [token] = fullToken.filter((item) => {
        return item.address.toLowerCase() === val.toLowerCase();
      });
      return token.name;
    },
    onreachbottom() {
      // console.log('onreachbottom', this.pageNum);
      const _this = this;

      return new Promise((resolve) => {
        setTimeout(async () => {
          _this.pageNum += 1;
          await _this.getreadPledgeHistory();
          resolve({});
        }, 1);
      });
    },
  },
  mounted() {
    this.pageNum = 1;
    this.showLoading = true;
    this.list = [];
    if (this.isReady) {
      this.getreadPledgeHistory();
    }
  },
  watch: {
    isReady() {
      this.getreadPledgeHistory();
    },
  },
  computed: {
    getHistory() {
      const columns = [
        {
          title: this.$t('history.table.pool'),
          slot: 'Pool',
          minWidth: 200,
        },
        {
          title: this.$t('history.table.action'),
          slot: 'Action',
          minWidth: 100,
        },
        {
          title: this.$t('history.table.amount'),
          slot: 'Amount',
          minWidth: 120,
        },
        {
          title: this.$t('history.table.status'),
          slot: 'Status',
          minWidth: 100,
        },
      ];
      return columns;
    },
    isReady() {
      return this.ethAddress && this.ethChainID;
    },
    ...mapState(['ethAddress', 'ethChainID', 'web3', 'ethersprovider']),
  },
};
</script>

<style lang="less" scoped>
.content-wapper {
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  margin: 20px 0 100px 0;
  padding: 44px;
  .earn-wapper {
    .earn-title {
      font-size: 20px;
      padding: 0 16px;
      line-height: 24px;
      margin-bottom: 5px;
    }
    .list-wapper {
      p {
        height: 19px;
        font-size: 16px;
        line-height: 19px;
        margin: 10px 0;
      }
      .Pool {
        display: flex;
        align-items: center;
        .imgages-wrapper {
          display: flex;
          margin-right: 12px;
          width: 40px;
          height: 24px;
          position: relative;
          .images {
            width: 24px;
            margin: auto;
          }
          .imgLeft {
            width: 24px;
            position: absolute;
            left: 0;
            top: 0;
          }
          .imgRight {
            width: 24px;
            position: absolute;
            left: 16px;
            top: 0;
            z-index: 5;
          }
        }
      }
      .Status {
        .status {
          color: #00d075;
        }
        .fail {
          color: #ff3c00;
        }
      }
    }
  }
  .noData-wapper {
    width: 100%;
    min-height: calc(100vh - 500px);
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-width: 80px;
    }
    p {
      margin-top: 8px;
      height: 16px;
      font-size: 14px;
      color: #8690a8;
      line-height: 16px;
    }
  }
}
</style>