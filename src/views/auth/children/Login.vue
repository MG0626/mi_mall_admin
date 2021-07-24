<template>
  <div class="login">
    <el-form>
      <el-form-item>
        <custom-input v-model="info.name" warning_msg="请输入帐号">邮箱/手机号码/小米ID</custom-input>
      </el-form-item>
      <el-form-item>
        <custom-input v-model="info.password" type="password" warning_msg="请输入登录密码">密码</custom-input>
      </el-form-item>
      <el-form-item>
        <div class="login_btn">
          <button type="button" :disabled="is_disabled" @click="handleClick" >登录</button>
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
        // 用户名
        name: '',
        // 密码
        password: ''
      }
    };
  },
  methods: {
    // 登录
    async handleClick(){
      // 发起网络请求登录获取token
      const { data, status } = await this.$http.post('/login', this.info);
      // 判断请求结果
      if(status !== 200) return this.$message.error(data);

      // 成功，则保存到缓存
      // 生成现在时间的时间戳
      const time = Date.now();
      data.time = time;
      const { token } = data;
      // 保存用户信息到vuex
      this.$store.dispatch('updateUserInfo', data);
      // 保存token到vuex
      this.$store.dispatch('updateToken', token);
      // 弹出提示
      this.$message.success(`登录成功，欢迎${data.name}~`);
      // 跳转到首页
      this.$router.push('/');
    }
  },
  computed: {
    is_disabled(){
      let flag = true;
      // 判断是否为空
      if (this.info.name.trim() && this.info.password.trim()) {
        flag = false;
      }
      return flag;
    }
  },
  components: {
    CustomInput,
  },
};
</script>

<style lang="less" scoped>
.login {
  .login_btn {
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
        background-color: rgba(255, 255, 255, .1);
      }
      &[disabled]{
        cursor: no-drop;
        background-color: rgba(255, 255, 255, .5);
      }
    }
  }
}
</style>
