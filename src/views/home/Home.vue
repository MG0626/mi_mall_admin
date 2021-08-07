<template>
  <div class="home">
    <el-container>
      <el-aside :width=" is_collapse ? '65px' : '180px'">
        <!-- 顶部logo -->
        <div class="header">
          <img class="img" src="../../assets/logo.png" />
          <div :class="['text', is_collapse ? 'text_active' : '']" >后台管理系统</div>
        </div>
        <!-- 导航栏区域 -->
        <navigation :is_collapse="is_collapse" :menus="menus" :icons="icons"  />
        <!-- 导航栏收缩按钮 -->
        <div class="collapse" @click="handleCollapse"><i :class="is_collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i></div>
      </el-aside>
      <el-container>
        <el-header height="48px">
          <div class="left">
            <!-- 面包屑 -->
            <breadcrumb :menus="menus" />
          </div>
          <div class="right">
            <el-dropdown type="primary" size="small">
              <div class="el-dropdown-link">
                <img class="avatar" :src="userInfo.avatar" />
                <span>{{userInfo.name}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><span @click="handleLogout">退出登录</span></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 导航栏
import Navigation from './children/navigation/Navigation.vue';
// 面包屑
import Breadcrumb from './children/breadcrumb/Breadcrumb.vue';
export default {
  data(){
    return {
      // 用户信息
      userInfo: null,
      // 导航栏菜单
      menus: [],
      // 导航栏图标
      icons: {
        1: 'el-icon-s-custom',
        2: 'el-icon-s-order',
        24: 'el-icon-s-goods',
        75: 'el-icon-s-promotion'
      },
      // 导航栏收缩开关
      is_collapse: false
    }
  },
  created(){
    // 获取用户信息
    this.getUserInfo();
    // 获取导航栏菜单
    this.getMenus();
  },
  methods: {
    // 获取用户信息
    getUserInfo(){
      // 从缓存获取
      const { id, name, email, avatar } = this.$store.state.userInfo;
      // 保存到data
      this.userInfo = { id, name, email, avatar };
    },
    // 获取导航栏菜单
    async getMenus(){
      // 发起请求
      const { data, status } = await this.$http.get(`/menus/${this.userInfo.id}`);
      // 判断请求结果
      if(status !== 200) return this.$message.error(data);
      // 获取成功，保存到data
      this.menus = data.menu;
      // 二级导航栏路由地址
      const pathArr = ['/'];
      this.menus.forEach(menu => {
        menu.children.forEach(item => {
          pathArr.push(item.path);
        })
      });
      // 保存导航栏的路由地址到vuex
      this.$store.dispatch('add', pathArr);
    },
    // 处理导航栏收起
    handleCollapse(){
      this.is_collapse = !this.is_collapse;
    },
    // 点击退出登录
    handleLogout(){
      // 删除缓存的信息
      window.localStorage.removeItem('info');
      // 提示
      this.$message.success('退出登录成功，期待下一次的见面~')
      // 跳转到登录页面
      this.$router.push('/login');
    }
    
  },
  components: {
    Navigation,
    Breadcrumb
  },
};
</script>

<style lang="less" scoped>
.home {
  min-width: 1024px;
  .el-header {
    background-color: #ffffff;
    color: #333;
    line-height: 48px;
    border-bottom: 3px solid #f8f9f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
  
    .el-dropdown-link {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #409EFF;
      padding: 0 5px;
      .avatar{
        width: 24px;
        height: 24px;
        border: 1px solid #ccc;
        border-radius: 50%;
      }
      span {
        margin-left: 10px;
        margin-right: 5px;
      }
    }
  }

  .el-aside {
    background-color: #304156;
    color: #bfcbd9;
    height: 100vh;
    position: relative;
    transition: all .5s;
    overflow: hidden;

    .header{
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .img{
        width: 30px;
      }
      .text{
        margin-left: 10px;
        font-size: 16px;
        font-weight: 500;
        opacity: 1;
        transition: all .2s linear .3s;
      }
      .text_active{
        position: absolute;
        top: -50%;
        opacity: 0;
      }
    }

    .collapse{
      width: 18px;
      text-align: center;
      padding: 0 20px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 20px;
    }
  }

  .el-main {
    background-color: #fff;
    color: #333;
    height: calc(100vh - 48px);
  }
}
</style>
