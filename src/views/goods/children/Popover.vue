<template>
  <el-popover
    placement="right"
    title="修改商品状态"
    width="200"
    trigger="manual"
    v-model="visible">
    <el-select v-model="value" placeholder="请选择" size="small">
      <el-option label="下架" :value="0"></el-option>
      <el-option label="在售" :value="1"></el-option>
      <el-option label="售罄" :value="2"></el-option>
    </el-select>
    <div class="btn">
      <el-button size="mini"  @click="visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="handleConfirm">确定</el-button>
    </div>
    <template #reference>
      <el-button size="mini" type="info" round icon="el-icon-edit-outline" @click="visible = !visible">状态</el-button>
    </template>
  </el-popover>
</template>

<script>
  export default {
    props: {
      is_status: {
        type: Number,
        default: 0
      },
      id: {
        type: Number,
        default: 0
      }
    },
    created(){
      this.value = this.is_status;
    },
    data(){
      return{
        visible: false,
        value: 0
      }
    },
    methods: {
      // 点击确定的事件
      async handleConfirm(){
        // 发起网络请求修改状态
        const { data, status } = await this.$http.put(`goods/status/${this.id}`, { is_status: this.value });
        if(status !== 200) return this.$message.error(data);
        // 成功，关闭popover
        this.visible = false;
        // 提示成功
        this.$message.success('修改状态成功');
        // 发射方法给父组件，刷新数据
        this.$emit('getGoodsList');
      }
    }
  }
</script>

<style lang="less" scoped>
.btn{
  text-align: right;
  margin-top: 15px;
}
</style>