<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <!-- 顶部logo -->
        <div class="top">
          <img class="logo" src="../../assets/logo.png" alt="xiaomi" />
          <p class="title">小米商城后台管理</p>
        </div>
        <!-- 导航栏区域 -->
        <el-menu
          default-active="home"
          background-color="#304156"
          text-color="#bfcbd9"
          unique-opened
        >
          <el-menu-item index="home">
            <template #title>
              <i class="el-icon-s-home"></i>
              <span>首页</span>
            </template>
          </el-menu-item>
          <el-submenu index="1">
            <template #title>
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header height="70px">Header</el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
};
</script>

<style lang="less" scoped>
.home {
  .el-header {
    background-color: #e9eef3;
    color: #333;
    line-height: 70px;
    border-bottom: 2px solid #d8dce5;
  }

  .el-aside {
    background-color: #304156;
    color: #bfcbd9;
    height: 100vh;

    .top {
      height: 70px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 20px;
      .logo {
        width: 30px;
        height: 30px;
      }
      .title {
        font-size: 14px;
      }
    }
    .el-menu{
      border: 0;
    }
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
  }
}
</style>
