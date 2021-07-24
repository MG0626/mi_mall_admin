<template>
  <div class="register">
    <el-form>
      <el-form-item>
        <custom-input v-model="info.name" warning_msg="请输入用户名"
          >用户名</custom-input
        >
      </el-form-item>
      <el-form-item>
        <custom-input
          v-model="info.email"
          ref="email"
          :warning_msg="warningEmailMsg ? warningEmailMsg : '请输入邮箱号'"
          @blur="handleEmailBlur"
          >邮箱</custom-input
        >
      </el-form-item>
      <el-form-item>
        <custom-input
          v-model="info.password"
          ref="password"
          type="password"
          :warning_msg="warningPasswordMsg ? warningPasswordMsg : '请输入输入密码'"
          @blur="handleBlur"
          >密码</custom-input
        >
      </el-form-item>
      <el-form-item>
        <custom-input
          v-model="info.checkPassword"
          type="password"
          ref="checkPassword"
          :warning_msg="warningPasswordMsg ? warningPasswordMsg : '请输入再次输入密码'"
          @blur="handleBlur"
          >重复密码</custom-input
        >
      </el-form-item>
      <el-form-item>
        <div class="btn">
          <button type="button" :disabled="!is_disabled" @click="handleClick">注册</button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入自定义的输入组件
import CustomInput from '@/components/customInput/CustomInput';
export default {
  data() {
    return {
      info: {
        name: '',
        email: '',
        password: '',
        checkPassword: '',
      },
      // 密码不一致警告
      warningPasswordMsg: '',
      // 邮箱格式警告
      warningEmailMsg: '',
    };
  },
  methods: {
    // 重复输入密码输入框失去焦点时触发
    handleBlur(value) {
      const password = this.info.password;
      const checkPassword = this.info.checkPassword;
      // 判断密码是否一致
      if (password && checkPassword && password !== checkPassword) {
        this.warningPasswordMsg = '两次输入密码不一致';
        this.$refs.checkPassword.openWarning();
        this.$refs.password.openWarning();
      }
      // 如果两者不为空的时候
      if (password && checkPassword) {
        // 判断是否相等
        if (password === checkPassword) {
          // 清空警告
          this.warningPasswordMsg = '';
          this.$refs.checkPassword.closeWarning();
          this.$refs.password.closeWarning();
        }
      }
    },
    // 处理邮箱
    handleEmailBlur(value){
      // 邮箱正则表达式
      const reg = /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
      // 判断邮箱格式是否正确
      if (value.trim() && !reg.test(value)) {
        this.warningEmailMsg = "邮箱格式有误";
        // 打开警告
        this.$refs.email.openWarning();
      }
      
      // 判断值为空，但警告信息存在，这个时候清空
      if (value.trim() === '' && this.warningEmailMsg) {
        this.warningEmailMsg = '';
      }
    },
    // 发起网络请求注册账号
    async handleClick(){
      // 需要的参数
      const info = {
        name: this.info.name,
        email: this.info.email,
        password: this.info.password
      }

      const { data, status } = await this.$http.post('/users', info);
      // 判断请求结果
      if(status !== 201) return this.$message.error(data);
      
      // 成功则提示，且跳转到login
      this.$message.success('注册成功，请登录~');
      this.$router.push('/login');
    }
  },
  computed: {
    is_disabled() {
      // 判断是否为空
      const keys = Object.keys(this.info);
      let flag = keys.every((key) => {
        return this.info[key].trim() !== '';
      });
      return flag && !this.warningEmailMsg && !this.warningPasswordMsg;
    },
  },
  components: {
    CustomInput,
  },
};
</script>

<style lang="less" scoped>
.btn {
  width: 100%;
  height: 60px;
  line-height: 60px;
  border-radius: 5px;
  text-align: center;
  background-color: #ff5c00;

  button {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
    border: 0;
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    &[disabled] {
      cursor: no-drop;
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
