<template>
  <!-- 
    current-page: 当前页码
    page-size： 当前页码显示的条数
    page-sizes: 可以选择的条数数组
    layout: 分页组件的功能
    total: 总条数
  -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="data.page_number"
    :page-sizes="[1, 2, 3, 5, 10]"
    :page-size="data.current_number"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  >
  </el-pagination>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default(){
        return {
          // 页码
          page_number: 1, 
          // 当前显示条数
          current_number: 5
        }
      }
    },
    // 总条数
    total: {
      type: Number,
      dafault: 0
    }
  },
  methods: {
    // pageSize 改变时会触发
    handleSizeChange(size){
      this.$emit('handleSizeChange', size);
    },
    // currentPage 改变时会触发
    handleCurrentChange(num){
      this.$emit('handleCurrentChange', num);
    }
  }
};
</script>

<style lang="less" scoped></style>
