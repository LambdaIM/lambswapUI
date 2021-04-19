<template>
  <div id="app">
    <layoutHead />
    <main class="main-wrapper container mx-auto">
      <router-view v-if="isRouterAlive" />
    </main>
    <!-- <initialWallet /> -->
    <layoutFoot />
  </div>
</template>

<script>
import layoutHead from '@/components/layout/header.vue';
import layoutFoot from '@/components/layout/footer.vue';

import initialWallet from '@/components/basic/initialWallet.vue';
import transactionPool from '@/components/basic/transactionPool.vue';

export default {
  mixins: [initialWallet, transactionPool],
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      screenWidth: document.body.clientWidth,
      isRouterAlive: true,
      timer: null,
    };
  },
  components: {
    layoutHead,
    layoutFoot,
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
        if (this.screenWidth < 1200) {
          this.$store.commit('changeIsMobile', true);
        } else {
          this.$store.commit('changeIsMobile', false);
        }
      })();
    };
  },
};
</script>
<style lang="less" scoped>
#app {
  width: 100%;
}

@media (max-width: 1200px) {
  .main-wrapper {
    margin-top: 72px;
    margin-bottom: 34px;
    min-height: calc(100vh - 106px);
  }
}

@media (min-width: 1201px) {
  .main-wrapper {
    margin-top: 112px;
    margin-bottom: 60px;
    min-height: calc(100vh - 208px);
  }
}
</style>
