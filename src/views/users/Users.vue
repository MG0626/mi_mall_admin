<template>
  <div class="register">
    <el-row type="flex">
      <el-col class="left">
        <div></div>
      </el-col>
      <!-- 登录和注册区域 -->
      <el-col class="right">
        <div class="header">
          <img class="img" src="../../assets/logo.png" />
          <div class="text">后台管理系统</div>
        </div>

        <el-card>
          <div class="nav">
            <a :class="$route.path === '/login' ? 'active' : ''" @click="handleNavClick('login')">登录</a>
            <a :class="$route.path === '/register' ? 'active' : ''" @click="handleNavClick('register')">注册</a>
          </div>
          <div class="view">
            <router-view />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data(){
    return {

    }
  },
  methods: {
    handleNavClick(value){
      // 路由地址
      const path = `/${value}`;
      // 跳转路由
      if(this.$route.path !== path){
        this.$router.push(path);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.register{
  .el-row{
    .left{
      width: 30%;
      & > div{
        background-image: url('https://cdn.web-global.fds.api.mi-img.com/mcfe--mi-account/static/static/media/banner.4994397e.jpg');
        background-size: cover;
        background-position: 50%;
        height: 100vh;
      }
    }
    .right{
      width: 100%;
      position: relative;
      .header{
        height: 80px;
        display: flex;
        align-items: center;
        padding-left: 20px;
        .img{
          width: 40px;
        }
        .text{
          margin-left: 10px;
          font-size: 24px;
          font-weight: 500;
        }
      }
      .el-card{
        width: 450px;
        padding: 20px 25px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .nav{
          a{
            text-decoration: none;
            color: #BBB;
            font-size: 22px;
            font-weight: 500;
            margin-right: 15px;
            cursor: pointer;
          }
          .active{
            border-bottom: 5px solid #ff5c00;
            color: #333;
          }
        }
        .view{
          padding-top: 20px;
        }
      }
    }
  }
}
</style>
