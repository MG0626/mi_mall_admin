<template>
  <el-menu
    :default-active="$route.path"
    background-color="#304156"
    text-color="#bfcbd9"
    unique-opened
    router
    :collapse="is_collapse"
    :collapse-transition="false"
  >
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span>首页</span>
    </el-menu-item>
    <el-submenu v-for="menu in menus" :key="menu.id" :index="menu.name">
      <template #title>
        <i :class="icons[menu.id]"></i>
        <span>{{ menu.name }}</span>
      </template>
      <el-menu-item
        v-for="item in menu.children"
        :key="item.id"
        :index="item.path"
        >{{ item.name }}</el-menu-item
      >
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  props: {
    // 判断导航栏是否收缩
    is_collapse: {
      type: Boolean,
      default: false,
    },
    // 导航栏菜单
    menus: {
      type: Array,
      default() {
        return [];
      },
    },
    // 导航栏图标
    icons: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu {
  border: 0;
}
</style>
