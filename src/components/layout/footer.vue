<template>
  <div class="footer-wrapper">
    <!-- pc底部栏 -->
    <footer v-if="!isMobile" class="footer pcFooter">
      <div class="footer-content container mx-auto flex justify-between items-center">
        <div class="left-wrapper">
          <div class="logo-wrapper flex justify-between items-center">
            <img src="../../assets/foot.png" alt="logo">
            <img class="ml-6" src="../../assets/lamb.png" alt="lamb">
          </div>
          <p>© 2021 LambSwap All rights reserved</p>
        </div>
        <div class="right-wrapper flex">
          <!-- <div class="contact-wrapper flex justify-between items-center">
            <div class="contact-item mr">
            <a href="/" target="_blank">
              <img src="../../assets/img/telegram.svg" alt="telegram">
            </a>
          </div>
          <div class="contact-item mr">
            <a href="/" target="_blank">
              <img src="../../assets/img/twiter.svg" alt="twiter">
            </a>
          </div>
          <div class="contact-item">
            <a href="/" target="_blank">
              <img src="../../assets/img/medium.svg" alt="medium">
            </a>
          </div>
          </div> -->
          <div class="flex items-center">
            <div class="wechat">
              <div class="isShow">
                <img src="../../assets/img/erweima.jpg" alt="erweima">
              </div>
              <img src="../../assets/img/WeChat.png" alt="WeChat">
            </div>
            <Select v-model="lang" class="lang-wrapper" style="width: 124px" @on-change="getSelectLang">
              <Option value="zh">
                简体中文
              </Option>
              <Option value="en">
                English
              </Option>
            </Select>
          </div>
        </div>
      </div>
    </footer>

    <!-- 移动端底部栏 -->
    <footer v-else class="mobileFooter container">
      <div :class="isActive=='mining'? 'menu-item activeMenu':'menu-item'" @click="activeMenu('mining')">
        <img src="../../assets/img/mining.svg" alt="mining">
        <img src="../../assets/img/mining-active.svg" alt="mining" class="acitveImg">
        <router-link to="/earn">
          {{ $t('header.nav.Earn1') }}
        </router-link>
        <!-- <p>挖矿</p> -->
      </div>
      <div :class="isActive=='swap'? 'menu-item activeMenu':'menu-item'" @click="activeMenu('swap')">
        <img src="../../assets/img/swap.svg" alt="swap">
        <img src="../../assets/img/swap-active.svg" alt="swap" class="acitveImg">
        <router-link to="/exchange">
          {{ $t('header.nav.Exchange') }}
        </router-link>
        <!-- <p>交易</p> -->
      </div>
      <div :class="isActive=='birdge'? 'menu-item activeMenu':'menu-item'" @click="activeMenu('birdge')">
        <img src="../../assets/img/birdge.svg" alt="birdge">
        <img src="../../assets/img/birdge-active.svg" alt="birdge" class="acitveImg">
        <a href="https://bridge.lambdastorage.com/">{{ $t('header.nav.Bridge') }}</a>
        <!-- <p>跨链</p> -->
      </div>
      <div :class="isActive=='doc'? 'menu-item activeMenu':'menu-item'" @click="activeMenu('doc')">
        <img src="../../assets/img/doc.svg" alt="doc">
        <img src="../../assets/img/doc-active.svg" alt="doc" class="acitveImg">
        <a href="https://lamb-swap.gitbook.io/lambswap/">{{ $t('header.nav.Docs') }}</a>
        <!-- <p>教程</p> -->
      </div>
      <div :class="isActive=='quotes'? 'menu-item activeMenu':'menu-item'" @click="activeMenu('quotes')">
        <img src="../../assets/img/quotes-active.svg" alt="quotes">
        <img src="../../assets/img/quotes.svg" alt="quotes" class="acitveImg">
        <a href="https://info.lambswap.fi/pair/0x3ef407f05ca26a641e3a3d40b4ca0e7622676e1a">{{ $t('header.nav.chart') }}</a>
        <!-- <p>行情</p> -->
      </div>
    </footer>
  </div>
</template>


<script>
import jscookie from 'js-cookie';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      lang: null,
      isActive: "mining",
    };
  },
  computed: {
    ...mapState(['isMobile'])
  },
  methods: {
    // 获取语言key
    getKey() {
      const key = jscookie.get("langkey");
      key === "zh" ? (this.lang = "zh") : (this.lang = "en");
      this.$i18n.locale = this.lang;
    },

    // 改变语言
    getSelectLang(val) {
      this.lang = val;
      this.$i18n.locale = this.lang;
      jscookie.set("langkey", this.lang, { expires: 180 });
    },
    activeMenu(name) {
      this.isActive = name;
    },
  },
  mounted() {
    this.getKey();
  },
};
</script>

<style lang="less" scoped>
@import "./media/index.less";
.footer-wrapper {
  width: 100%;
  .footer {
    width: 100%;
    height: 100%;
    background: #050d26;
    .footer-content {
      height: 100%;
      .left-wrapper {
        .logo-wrapper {
          width: 150px;
        }
        p {
          margin-top: 10px;
          font-size: 12px;
          font-weight: 400;
          color: #ffffff;
          line-height: 14px;
        }
      }
      .right-wrapper {
        .mr {
          margin-right: 24px;
        }
      }
    }
  }
}
.wechat {
  cursor: pointer;
  position: relative;
  .isShow {
    display: none;
    position: absolute;
    left: -95px;
    top: -225px;
    img {
      max-width: 200px;
    }
  }
  ::before {
    content: "";
    display: block;
    position: absolute;
    left: 90px;
    bottom: -38px;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-top: 20px solid #fff;
  }
  img {
    max-width: 30px;
  }
}
.wechat:hover .isShow {
  display: block;
}
.lang-wrapper {
  margin-left: 20px;
}
</style>