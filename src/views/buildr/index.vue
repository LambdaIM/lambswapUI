<template>
  <div class="buildr-warp">
    <div class="tab">
      <div
        :class="{'tab-item': true, 'tab-active': nav === 'balance'}"
        @click="toPage('balance')"
      >
        {{ $t('build-manage') }}
      </div>
      <div
        :class="{'tab-item': true, 'tab-active': nav === 'history'}"
        @click="toPage('history')"
      >
        {{ $t('build-history') }}
      </div>
      <div>
        <button
          class="btn create-btn"
          @click="toPage('create')"
        >
          + {{ $t('build-create-vault') }}
        </button>
      </div>
    </div>
    <div class="buildr-content">
      <router-view />
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less">
  .buildr-warp {
    .mrg-t-10 {
      margin-top: 10px;
    }
    .mrg-t-20 {
      margin-top: 20px;
    }
    .mrg-b-5 {
      margin-bottom: 5px;
    }
    .mrg-tb-10 {
      margin: 10px 0px;
    }
    .mrg-tb-20 {
      margin: 20px 0px;
    }
    .mrg-tb-40 {
      margin: 40px 0px;
    }
    .mrg-b-40 {
      margin-bottom: 40px;
    }
    .f-gray {
      color: #828489;
    }
    .f-size-20 {
      font-size: 20px;
    }
    input::-webkit-input-placeholder {
      color: #afb1b6;
      font-size: 24px;
    }
    .text-right {
      text-align: right;
    }
    .box-shadow {
      padding: 32px;
      box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
      border-radius: 12px;
    }
    .title{
      font-size: 20px;
      line-height: 24px;
    }
    .tab {
      position: relative;
      margin: 24px 0px 24px 0px;
      .tab-item {
        position: relative;
        display: inline-block;
        height: 20px;
        line-height: 20px;
        margin-right: 40px;
        color: #14171c66;
        font-size: 16px;
        cursor: pointer;
      }
      .tab-active {
        color: #14171C;
      }
      .tab-active::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -10px;
        transform: translateX(-50%);
        width: 48px;
        height: 2px;
        background: #FF41A1;
      }
      .create-btn {
        position: absolute;
        right: 0px;
        top: 0px;
        width: 120px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        color: #FF41A1;
        background: rgba(0, 88, 255, 0.1);
        border-radius: 16px;
        &:hover{
          background: rgba(0, 88, 255, 0.2);
        }
      }
    }
  }
</style>
