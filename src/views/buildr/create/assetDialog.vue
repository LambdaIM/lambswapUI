<template>
  <div class="asset-dialog">
    <Modal v-model="openAssetDialog" class-name="asset-modal" :transfer="true" :footer-hide="true" :closable="true">
      <div class="modal-content">
        <p slot="header" class="title text-center">
          {{ $t('build-Assets') }}
        </p>
        <div class="input-wrapper flex items-center">
          <img src="../../../assets/img/search-16.png">
          <input v-model="searchCon" type="text" @keyup="search">
        </div>
        <template v-for="(item, index) in assetData">
          <div :key="index" class="asset-content" @click="selectToken(item.name)">
            <div class="flex justify-between items-center">
              <div class="con-wapper flex justify-between items-center">
                <template>
                  <img :src="getTokenImg(item.token)" :alt="item.token">
                </template>
                <div class="text-wrapper">
                  <p>{{ item.name }}</p>
                  <span>{{ item.desc }}</span>
                </div>
              </div>
              <div :class="tokenName === item.name ? 'icon-active' : 'img-wrapper'">
                <img src="../../../assets/img/check-blue-24.png">
              </div>
            </div>
          </div>
        </template>
      </div>
    </Modal>
  </div>
</template>

<script>

export default {
  data() {
    return {
      tokenInfo: [],
      openAssetDialog: false,
      assetData: [],
      backupData: [],
      searchCon: '',
      tokenName: '',
    };
  },
  methods: {
    open({data, defaultTokenName}) {
      this.tokenName = defaultTokenName;
      this.tokenInfo = data;
      this.assetData = data;
      this.openAssetDialog = true;
    },
    getTokenImg(tokensymbol){
      return this.$parent.getTokenImg(tokensymbol);
    },
    selectToken(tokenName) {
      this.$parent.setAsset(tokenName);
      this.openAssetDialog = false;
      this.searchCon = '';
    },
    search() {
      const val = this.searchCon.toLowerCase();
      this.assetData = this.tokenInfo.filter(item => item.token.toLowerCase().includes(val));
    },
  },
};
</script>

<style lang="less" scoped>
.asset-modal {
  width: 452px;
  padding: 24px;
  .title {
    font-size: 24px;
    line-height: 50px;
  }
  .input-wrapper {
    padding: 5px 10px;
    width: 100%;
    height: 40px;
    background: #f7f8f9;
    border-radius: 6px;
    input {
      width: 80%;
      height: 100%;
      background: #f7f8f9;
      outline: none;
    }
  }

  .asset-content {
    cursor: pointer;
    margin-top: 20px;
    border-bottom: 1px solid #f7f8f9;
    padding: 12px 16px;
    // box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.06);
    img {
      max-width: 32px;
      margin-right: 16px;
    }
    .text-wrapper {
      p {
        font-size: 16px;
        line-height: 19px;
      }
      span {
        font-size: 12px;
        color: #828489;
        line-height: 14px;
      }
    }

    .img-wrapper {
      display: none;
    }
    .icon-active {
      display: block;
    }
  }
  .disableAssets-wrapper {
    cursor: not-allowed;
    img {
      opacity: 0.4;
    }
    .disableAssets {
      p {
        color: rgba(20, 23, 28, 0.4);
      }
      span {
        color: rgba(130, 132, 137, 0.4);
      }
    }
  }
}
</style>
