<template>
  <div class="earn-wrapper">
    <div class="content-wrapper">
      <div class="menu-wrapper flex justify-between items-center">
        <div class="switch-wrapper flex justify-start items-center">
          <template v-for="(item, index) in menuList">
            <button
              :key="index"
              class="menu-item"
              :class="name === item.id ? 'active-menu' : ''"
              @click="toPage(item.id)"
            >
              {{ item.name }}
            </button>
          </template>
        </div>
        <div class="checkNotice">
          <a
            class="underline noticeText"
            href="https://github.com/armors/armors_audits/blob/main/LambSwap_audit.pdf"
            target="_blank"
          >
            {{ $t('check.notice') }}
          </a>
        </div>
      </div>

      <div class="earn-child-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: 'rewardMine',
    };
  },
  methods: {
    toPage(name) {
      this.name = name;
      switch (name) {
        case 'rewardMine':
          this.$router.push(`/earn`);
          break;

        case 'myMine':
          this.$router.push(`/earn/myMine`);
          break;

        case 'pool':
          this.$router.push(`/earn/pool`);
          break;

        // case 'earn-history':
        //   this.$router.push(`/earn/history`);
        //   break;

        default:
          this.$router.push(`/earn`);
          break;
      }
    },
  },
  computed: {
    menuList() {
      const list = [
        {
          id: 'rewardMine',
          name: this.$t('tabMenu.earn'),
        },
        {
          id: 'pool',
          name: this.$t('swap.subMenu2'),
        },
        {
          id: 'myMine',
          name: this.$t('tabMenu.myPage'),
        },
        // {
        //   id: 'earn-history',
        //   name: this.$t('tabMenu.history'),
        // },
      ];
      return list;
    },
  },
  mounted() {
    this.name = this.$route.name;
  },
};
</script>

<style lang="less" scoped>
@import './media/media.less';
.earn-wrapper {
  margin-top: 24px;
  .content-wrapper {
    width: 100%;
    .menu-wrapper {
      margin-bottom: 24px;
      .switch-wrapper {
        .menu-item {
          display: inline-block;
          // font-size: 16px;
          color: rgba(20, 23, 28, 0.4);
          line-height: 19px;
          // margin-right: 48px;
        }
        .active-menu {
          color: rgba(20, 23, 28, 1);
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

    .earn-child-content {
      margin-bottom: 110px;
    }
  }
}
</style>