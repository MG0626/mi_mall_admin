<template>
  <div class="role">
    <el-card>
      <!-- 搜索和添加角色区域 -->
      <el-row type="flex" align="middle" :gutter="10">
        <el-col :span="5">
          <el-input 
            v-model="params.query_params" 
            size="mini" 
            placeholder="请输入内容" 
            clearable 
            @clear="getRoleList"
            @blur="getRoleList"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="getRoleList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="2"><el-button type="primary" size="mini" @click="addDialogVisible = true">添加角色</el-button></el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table 
        stripe 
        border 
        size="small" 
        v-loading="loading" 
        :data="list">
        <el-table-column align="center" type="index" label="序号"></el-table-column>
        <el-table-column align="center" label="名称" prop="role_name"></el-table-column>
        <el-table-column align="center" label="描述" prop="role_desc"></el-table-column>
        <el-table-column align="center" label="操作">
          <template scope="scope">
            <el-button size="mini" type="primary" round icon="el-icon-edit" @click="handleOpenEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" round icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    
      <!-- 分页 -->
      <pagination 
        :data="params" 
        :total="total" 
        @handleSizeChange="handleSizeChange" 
        @handleCurrentChange="handleCurrentChange" />
      
      <!-- 添加用户的Dialog 对话框 -->
      <el-dialog
        :visible.sync="addDialogVisible"
        width="40%">
        <template #title>
          <div class="title">添加角色</div>
        </template>

        <el-form :model="info" ref="ruleForm" label-position="right" :rules="rules">
          <el-form-item label="名称" prop="role_name" label-width="70px">
            <el-input v-model="info.role_name" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="描述" prop="role_desc" label-width="70px">
            <el-input v-model="info.role_desc" placeholder="请输入角色描述" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="handleDialogClose">取 消</el-button>
          <el-button type="primary" @click="handleAddPermission">确 定</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Pagination from '../../components/pagination/Pagination.vue';
  export default {
  components: { Pagination },
    data(){
      return {
        // 请求参数
        params: {
          // 查询参数
          query_params: '', 
          // 页码
          page_number: 1, 
          // 当前显示条数
          current_number: 5
        },
        // 角色列表
        list: [],
        // loading开关
        loading: false,
        // 列表总条数
        total: 0,
        // 添加角色的Dialog 对话框开关
        addDialogVisible: false,
        // 角色信息
        info: {
          role_name: '',
          role_desc: ''
        },
        // 验证规则
        rules: {
          role_name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          role_desc: [
            { required: true, message: '请输入角色描述', trigger: 'blur' }
          ]
        }
      }
    },
    created(){
      // 获取角色列表
      this.getRoleList();
    },
    methods: {
      // 获取角色列表
      async getRoleList(){
        // 打开loading
        this.loading = true;
        const { data, status } = await this.$http.get('/role/list', { params: this.params });
        // 判断是否成功
        if(status !== 200) return this.$message.error(data);
        // 成功就保存到list
        this.list = data.data;
        this.total = data.total;
        // 关闭loading
        this.loading = false;
      },
      // pageSize 改变时会触发
      handleSizeChange(size){
        // 修改每页条数
        this.params.current_number = size;

        // 重新请求数据
        this.getRoleList();
      },
      // currentPage 改变时会触发
      handleCurrentChange(num){
        // 修改页码
        this.params.page_number = num;

        // 重新请求数据
        this.getRoleList();
      },
      // 打开编辑
      handleOpenEdit(row){

      },
      // 删除角色
      handleDelete(row){
        // 获取id，名称
        const { id, role_name } = row;
        this.$confirm(`此操作将永久删除该角色'${role_name}', 是否继续?`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data, status } = await this.$http.delete(`/role/delete/${id}`);
          if(status !== 200) return this.$message.error(data);
          this.$message.success('删除成功!');
          // 重新获取数据
          this.getRoleList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 关闭dialog
      handleDialogClose(){
        this.addDialogVisible = false;
      },
      // 添加角色
      handleAddPermission(){
        // 验证是否通过
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            // 发起网络请求
            const { data, status } = await this.$http.post('/role/add', this.info);
            if(status !== 201) return this.$message.error(data);
            // 关闭dialog
            this.addDialogVisible = false;
            // 提示
            this.$message.success('角色添加成功！');
            // 刷新数据
            this.getRoleList();
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
.role{
  .el-dialog{
    .title{
      font-size: 18px;
      font-weight: 500;
      text-align: center;
    }
  }
}
</style>