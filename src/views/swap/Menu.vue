<template>
  <div class="connect-wrapper">
    <div class="content-wrapper">
      <div class="menu-wrapper flex justify-between items-center">
        <div class="switch-wrapper flex justify-start items-center">
          <button
            class="menu-item"
            :class="nameclass === 'pool'? 'active-menu':''"
            @click="toPage('pool')"
          >
            {{ $t('swap.subMenu2') }}
          </button>

          <button
            class="menu-item"
            :class="nameclass === 'swap'? 'active-menu':''"
            @click="toPage('swap')"
          >
            {{ $t('swap.subMenu1') }}
          </button>

          <button
            class="menu-item"
            :class="nameclass === 'history'? 'active-menu':''"
            @click="toPage('history')"
          >
            {{ $t('swap.subMenu3') }}
          </button>
        </div>

        <div class="checkNotice">
          <a class="underline noticeText" href="https://github.com/armors/armors_audits/blob/main/LambSwap_audit.pdf" target="_blank">
            {{ $t('check.notice') }}
          </a>
        </div>
      </div>
      <router-view />
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      name: 'swap',
    };
  },
  methods: {
    toPage(name) {
      this.name = name;
      if (name === 'swap') {
        this.$router.push('/exchange/swap');
      } else if (name === 'pool') {
        this.$router.push('/exchange/');
      } else {
        this.$router.push('/exchange/history');
      }
    },
  },
  mounted() {
    this.name = this.$route.name;
  },
  computed: {
    nameclass: function () {
      const name = this.$route.name;
      console.log(name);
      return name;
    },
  },
};
</script>

<style lang="less" scoped>
.connect-wrapper {
  margin-top: 24px;
  // height: 100vh;
  .content-wrapper {
    width: 100%;
    .menu-wrapper {
      margin-bottom: 24px;
      .switch-wrapper {
        // margin-left: 100px;
        .menu-item {
          display: inline-block;
          font-size: 16px;
          font-weight: 500;
          color: rgba(20, 23, 28, 0.4);
          line-height: 19px;
          margin-right: 48px;
        }
        .active-menu {
          color: #ff41a1;
          padding: 4px;
          border-radius: 0px;
          border-bottom: 2px solid #ff41a1;
        }
      }
      .checkNotice {
        .noticeText {
          color: rgba(20, 23, 28, 0.4);
          &:hover {
            color: #ff41a1;
          }
        }
      }
    }
  }
}
</style>