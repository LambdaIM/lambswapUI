<template>
  <div :class="{'input-group': true, 'input-focus': focus, 'input-error': isError}">
    <div
      v-if="title"
      class="input-prepend"
    >
      {{ title }}
    </div>
    <input
      v-model="inputVal"
      type="input"
      name="repay"
      autoComplete="off"
      :class="{'input-inner': true, 'no-title': !title}"
      :placeholder="placetext"
      :disabled="disabled"
      @focus="onInputFocus"
      @blur="onInputBlur"
    >
    <div class="input-append">
      {{ unit }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ScInput',
    props: ['title', 'unit', 'placetext', 'disabled', 'onChange', 'defaultValue', 'isError'],
    data() {
      return {
        inputVal: '',
        focus: false
      };
    },
    methods: {
      onInputFocus() {
        this.focus = true;
      },
      onInputBlur() {
        this.focus = false;
      },
      onChangeValue(val){
        const value = val || 0;
        this.onChange && this.onChange(value);
      }
    },
    watch: {
      inputVal(val) {
        this.onChangeValue(val);
      },
      defaultValue(val) {
        this.inputVal = val;
      }
    },
    created() {
      this.onChangeValue(this.inputVal);
    }
  };

</script>

<style lang="less" scoped>
.input-group {
    width: 100%;
    display: inline-table;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 16px;
    .input-prepend {
      position: relative;
      display: table-cell;
      height: 70px;
      width: 100px;
      padding-top: 5px;
      background-color: #F7F8F9;
      color: #14171C;
      vertical-align: middle;
      text-align: center;
      border: 1px solid #dcdfe6;
      border-right: none;
      border-radius: 8px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      white-space: nowrap;
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    }
    .input-inner {
      display: inline-block;
      background-color: #F7F8F9;
      border: 1px solid #dcdfe6;
      border-left: none;
      border-right: none;
      box-sizing: border-box;
      color: #FF41A1;
      font-size: 30px;
      height: 70px;
      outline: none;
      padding: 20px 15px;
      width: 100%;
      vertical-align: middle;
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    }
    .input-append {
      position: relative;
      display: table-cell;
      vertical-align: middle;
      padding-top: 5px;
      width: 100px;
      height: 70px;
      background-color: #F7F8F9;
      color: #14171C;
      text-align: center;
      border: 1px solid #dcdfe6;
      border-left: none;
      border-radius: 8px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      white-space: nowrap;
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    }
    .no-title {
      border-left: 1px solid #dcdfe6;
      border-radius: 8px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
}
.input-focus {
  .input-prepend {
    border: 1px solid #FF41A1;
    border-right: none;
  }
  .input-append {
    border: 1px solid #FF41A1;
    border-left: none;
  }
  .input-inner {
    border: 1px solid #FF41A1;
    border-left: none;
    border-right: none;
  }
  .no-title {
    border-left: 1px solid #FF41A1;
  }
}
.input-error {
  .input-prepend {
    border: 1px solid #ff3d00;
    border-right: none;
  }
  .input-append {
    border: 1px solid #ff3d00;
    border-left: none;
  }
  .input-inner {
    border: 1px solid #ff3d00;
    border-left: none;
    border-right: none;
  }
  .no-title {
    border-left: 1px solid #ff3d00;
  }
}
</style>
