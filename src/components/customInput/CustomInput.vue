<template>
  <div>
    <div :class="{'wrapper_warning': is_warning, wrapper: true} ">
      <label id="input">
        <div class="desc" ref="desc">
          <slot></slot>
        </div>
        <input
          :type="is_show ? 'text' : type"
          label="input"
          :value="value"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
        />
      </label>
      <div class="show_pass" v-if="type === 'password'" @click="handleClick">
        <div v-if="is_show">
          <svg
            viewBox="0 0 20 20"
            width="1em"
            height="1em"
            fill="currentColor"
            class="mi-password-field__icon"
          >
            <path
              d="M10 3c4.003 0 7.53 2.102 9.593 5.291a2.53 2.53 0 010 2.75c-2.063 3.19-5.59 5.292-9.593 5.292s-7.53-2.101-9.593-5.29a2.53 2.53 0 010-2.752C2.47 5.101 5.997 3 10 3zm-.012 2.333a4.337 4.337 0 00-4.34 4.334A4.337 4.337 0 009.988 14c2.397 0 4.34-1.94 4.34-4.333a4.337 4.337 0 00-4.34-4.334zm0 1.334a3.002 3.002 0 013.004 3c0 1.657-1.345 3-3.004 3a3.002 3.002 0 01-3.005-3c0-1.657 1.345-3 3.005-3z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div v-else>
          <svg
            viewBox="0 0 20 20"
            width="1em"
            height="1em"
            fill="currentColor"
            class="mi-password-field__icon"
          >
            <path
              d="M19.78 7.738a.964.964 0 00-1.488-1.227 10.567 10.567 0 01-2.159 1.98 10.487 10.487 0 01-5.958 1.848 10.514 10.514 0 01-2.826-.381 10.394 10.394 0 01-1.977-.776 10.612 10.612 0 01-3.646-3.095.964.964 0 00-1.547 1.15c.487.655 1.037 1.26 1.642 1.808a.955.955 0 00-.084.17l-1.01 2.692a.964.964 0 101.806.677l.868-2.32a12.316 12.316 0 002.632 1.298l-.528 2.696a.964.964 0 101.893.371l.504-2.569c1.358.25 2.747.275 4.113.072l.44 2.417a.964.964 0 101.898-.346l-.455-2.502a12.37 12.37 0 002.381-1.029l.993 2.333a.964.964 0 001.775-.756l-1.139-2.673a12.537 12.537 0 001.871-1.838z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    <div class="warning" v-if="is_warning">{{ warning_msg }}</div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'text'
    },
    // 警告提示
    warning_msg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 输入框的值
      value: '',
      // 是否显示密码
      is_show: false,
      // 是否发出警告
      is_warning: false
    };
  },
  methods: {
    // 输入框获取焦点时触发
    handleFocus() {
      // 关闭警告
      this.is_warning = false;
      // 获取desc元素
      const desc = this.$refs.desc;
      desc.style.top = '25px';
      desc.style.fontSize = '12px';
      desc.style.transform = 'translateY(0px)';
    },
    // 输入框失去焦点时触发
    handleBlur(e) {
      // 判断是否已经有值，有值就不操作
      if (this.value === '') {
        // 获取desc元素
        const desc = this.$refs.desc;
        desc.style.fontSize = '17px';
        desc.style.transform = 'translateY(10px)';
        // 为空，发出警告
        this.is_warning = true;
      }
      // 向父组件发送事件
      this.$emit('blur', e.target.value);
    },
    // 输入框输入值时触发
    handleInput(e) {
      // 获取当前输入的值
      const currentValue = e.target.value;
      this.value = currentValue;
      // 发送出去
      this.$emit('input', currentValue);
    },
    // 点击切换显示密码
    handleClick() {
      this.is_show = !this.is_show;
    },
    // 发出警告事件
    openWarning(){
      this.is_warning = true;
    },
    // 关闭警告事件
    closeWarning(){
      this.is_warning = false;
    }
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  height: 60px;
  padding: 5px 20px;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: #bababa;
  box-sizing: border-box;
  overflow: hidden;

  #input {
    position: relative;
    .desc {
      height: 50px;
      line-height: 50px;
      font-size: 17px;
      box-sizing: border-box;
      transform: translateY(0px);
      transition: all 0.3s, font-size 0s;
      position: relative;
      z-index: 2;
    }
    input {
      width: 100%;
      height: 30px;
      line-height: 30px;
      border: 0;
      background-color: rgba(0, 0, 0, 0);
      padding: 0;
      &:focus {
        outline: none;
      }
    }
  }

  .show_pass {
    width: 20px;
    height: 20px;
    color: rgba(0, 0, 0, 0.25);
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translate(0, -50%);
    z-index: 3;
    cursor: pointer;

    svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    &:hover {
      color: #333;
    }
  }
}
.warning{
  height: 15px;
  font-size: 12px;
  color: #f04645;
}

.wrapper_warning {
  background-color: #fcf2f3;
  color: #f04645;
  
  .show_pass{
    top: 40%;
    transform: translate(0, -50%);
  }
}
</style>
