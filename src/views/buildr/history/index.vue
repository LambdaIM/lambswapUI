<template>
  <div class="content-wapper">
    <div v-if="!ethAddress||list.length==0" class="noData-wapper">
      <div class="flex flex-col items-center">
        <img src="../../../assets/img/noData.png" alt="noData">
        <p>No Data</p>
      </div>
    </div>
    <div v-else class="earn-wapper">
      <Scroll :loading-text="'loading....'" :on-reach-bottom="onReachBottom" :height="400">
        <div class="list-wapper">
          <Table :columns="getHistory" :data="list">
            <template slot="Assets" slot-scope="{row}">
              <div class=" Assets">
                <div class="imgages-wrapper">
                  <img :src="getTokenImg(row.assets)" class="images">
                </div>
                <p>
                  {{ row.assets }}
                </p>
              </div>
            </template>
            <template slot="Action" slot-scope="{ row}">
              <div class="Action">
                <p class="action">
                  {{ row.actions }}
                </p>
              </div>
            </template>
            <template slot="Amount" slot-scope="{ row}">
              <div class="Amount">
                <p class="amount">
                  {{ row.amount }}
                </p>
              </div>
            </template>
            <template slot="Date" slot-scope="{ row}">
              <div class="Date">
                <p class="date">
                  {{ row.date | formatDate }}
                </p>
              </div>
            </template>
            <template slot="Status" slot-scope="{ row}">
              <div class="Status">
                <p class="status success">
                  {{ row.status }}
                </p>
              </div>
            </template>
          </Table>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
.content-wapper {
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  margin: 20px 0 100px 0px;
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
      }
      .Assets {
        display: flex;
        align-items: center;
        .imgages-wrapper {
          display: flex;
          margin-right: 6px;
          img {
            width: 24px;
            margin: auto;
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
