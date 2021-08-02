<template>
  <div class="category">
    <el-card>
      <!-- 添加分类区域 -->
      <el-row>
        <el-col><el-button type="primary" size="mini" @click="dialogVisible = true">添加分类</el-button></el-col>
      </el-row>

      <el-table stripe border size="small" :data="list" v-loading="loading">
        <el-table-column align="center" type="index" label="序号"></el-table-column>
        <el-table-column align="center" label="名称" prop="name"></el-table-column>
        <el-table-column align="center" label="状态" prop="is_status">
          <template #default="scope">
            <el-switch
              v-model="scope.row.is_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitchChange($event, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button size="mini" type="primary" round icon="el-icon-edit" @click="handleOpenEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" round icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      width="30%">
      <template #title>
        <div class="title">{{ is_edit ? '修改分类信息' : '添加分类'}}</div>
      </template>
      <el-form ref="ruleForm" :model="info" label-position="right">
        <el-form-item 
          label="分类名称" 
          prop="name" 
          :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]"
          label-width="80px">
          <el-input v-model="info.name" size="small" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="handleAddOrEdit" :disabled="info.name.trim() === ''">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        // 分类列表
        list: [],
        // loading开关
        loading: false,
        // dialog开关
        dialogVisible: false,
        // 分类信息
        info: {
          name: ''
        },
        // 编辑开关
        is_edit: false,
        // 当前编辑的分类id
        current_id: 0
      }
    },
    created(){
      this.getCategoryList();
    },
    methods: {
      async getCategoryList(){
        // 打开loading
        this.loading = true;
        // 获取数据
        const { data, status } = await this.$http.get('category/list');
        if(status !== 200) return this.$message.error(data);
        this.list = data;
        // 关闭loading
        this.loading = false;
      },
      // 打开编辑
      handleOpenEdit(row){
        // 获取当前分类id
        this.current_id = row.id;
        // 获取当前分类名称
        this.info.name = row.name;
        // 打开编辑开关
        this.is_edit = true;
        // 打开dialog
        this.dialogVisible = true;
      },
      // 删除
      async handleDelete(row){
        // 获取id，名称
        const { id, name } = row;
        this.$confirm(`此操作将永久删除该分类'${name}', 是否继续?`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data, status } = await this.$http.delete(`/category/delete/${id}`);
          if(status !== 200) return this.$message.error(data);
          this.$message.success('删除成功!');
          // 重新获取数据
          this.getCategoryList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // dialog确定按钮事件
      async handleAddOrEdit(){
        // 编辑
        if (this.is_edit) {
          // 发起请求
          const { data, status } = await this.$http.put(`category/update/${this.current_id}`, this.info);
          if(status !== 200) return this.$message.error(data);
          this.$message.success('修改成功');
        }else{
          // 添加
          const { data, status } = await this.$http.post('category/add', this.info);
          if(status !== 201) return this.$message.error(data);
          this.$message.success('添加成功');
        }
        // 关闭dialog
        this.dialogVisible = false;
        // 关闭编辑
        this.is_edit = false;
        // 清空数据
        this.info.name = '';
        // 刷新数据
        this.getCategoryList();
      },
      // dialog关闭回调
      handleDialogClose(){
        // 清空警告
        this.$refs.ruleForm.resetFields();
        // 关闭dialog
        this.dialogVisible = false;
        // 当前若在编辑
        if (this.is_edit) {
          // 关闭编辑
          this.is_edit = false;
          // 清空数据
          this.info.name = '';
        }
      },
      // 修改状态触发
      async handleSwitchChange(value, row){
        // 发起请求
        const { data, status } = await this.$http.put(`category/status/${row.id}`, { is_status: value });
        if(status !== 200) {
          row.is_status = !value;
          return this.$message.error(data);
        }
        this.$message.success('修改成功');
      }
    }
  }
</script>

<style lang="less" scoped>
.category{
  .el-dialog{
    .title{
      font-size: 18px;
      font-weight: 500;
      text-align: center;
    }
  }
}
</style>