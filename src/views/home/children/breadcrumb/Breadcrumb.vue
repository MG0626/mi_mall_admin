<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in subitem" :key="index">{{item}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    menus: {
      type: Array,
      dafault(){
        return []
      }
    }
  },
  computed: {
    subitem(){
      // 获取当前路由地址
      const path = this.$route.path;
      // 面包屑子项数组
      const arr = [];
      // 如果路径为根路径，不进行以下操作
      if(path !== '/'){
        // 根据路由地址获取对应面包屑子项数据
        this.menus.forEach(item => {
          item.children.forEach(i => {
            // 如果地址符合当前地址，则保存数据到数组
            if (i.path === path) {
              arr.push(i.parent_name);
              arr.push(i.name);
            }
          });
        })
        
      }
      return arr;
    }
  }
}
</script>

<style lang="less" scoped></style>
