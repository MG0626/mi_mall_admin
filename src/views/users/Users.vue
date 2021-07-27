<template>
  <el-card>
    <!-- 搜索和添加用户区域 -->
    <el-row type="flex" align="middle" :gutter="10">
      <el-col :span="5">
        <el-input 
          v-model="params.query_params" 
          size="mini" 
          placeholder="请输入内容" 
          clearable 
          @clear="getUserList"
          @blur="getUserList"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="getUserList"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="2"><el-button type="primary" size="mini" @click="addUserDialogVisible = true">添加用户</el-button></el-col>
    </el-row>

    <!-- 用户列表 -->
    <el-table stripe border size="small" v-loading="loading" :data="list">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column label="用户名" align="center" prop="name"></el-table-column>
      <el-table-column label="邮箱" align="center" prop="email"></el-table-column>
      <el-table-column label="角色" align="center" prop="role_name"></el-table-column>
      <el-table-column label="状态" align="center" prop="is_status" >
        <template scope="scope">
          <el-switch v-model="scope.row.is_status" @change="handleSwitchChange($event, scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template scope="scope">
          <el-button size="mini" type="primary" round icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
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
      :visible.sync="addUserDialogVisible"
      width="40%">
      <template #title>
        <div class="title">添加用户</div>
      </template>
      <register @success="handleAddSuccess"/>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog
      :visible.sync="editDialogVisible"
      width="30%">
      <template #title>
        <div class="title">编辑</div>
      </template>
      <el-form :model="editInfo" label-position="right" label-width="60px" label-suffix=":">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="editInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            :action="$http.defaults.baseURL + '/upload/avatar'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="editInfo.avatar" :src="editInfo.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="editInfo.role_id" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.role_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate">确 定</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
// 分页
import Pagination from '../../components/pagination/Pagination.vue';
// 注册用户
import Register from '../auth/children/Register.vue';

  export default {
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
        // 用户列表
        list: [],
        // loading开关
        loading: false,
        // 列表总条数
        total: 0,
        // 添加用户的Dialog 对话框开关
        addUserDialogVisible: false,
        // 编辑开关
        editDialogVisible: false,
        // 编辑的信息
        editInfo: {
          id: 0,
          name: '',
          avatar: '',
          role_id: 0
        },
        // 角色列表
        roles: [],
        // 图片上传的请求头
        headers: {
          Authorization: this.$store.state.token
        }
      }
    },
    created(){
      // 获取用户列表
      this.getUserList();
    },
    methods: {
      // 获取用户列表
      async getUserList(){
        // 打开loading
        this.loading = true;
        const { data, status } = await this.$http.get('/users/list', { params: this.params });
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
        this.getUserList();
      },
      // currentPage 改变时会触发
      handleCurrentChange(num){
        // 修改页码
        this.params.page_number = num;

        // 重新请求数据
        this.getUserList();
      },
      // 修改用户状态
      async handleSwitchChange(value, row){
        // 格式化布尔值
        const newValue = Number(value);
        // 发起请求
        const { data, status } = await this.$http.put(`/users/status/${row.id}`, { is_status: newValue });
        if(status !== 200) {
          row.is_status = !value;
          return this.$message.error(data);
        }
        this.$message.success('修改用户状态成功~');
      },
      // 删除用户
      handleDelete(row){
        const { id, name } = row;
        this.$confirm(`此操作将永久删除该用户'${name}', 是否继续?`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data, status } = await this.$http.delete(`/users/delete/${id}`);
          if(status !== 200) return this.$message.error(data);
          this.$message.success('删除成功!');
          // 重新获取数据
          this.getUserList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 添加用户成功的回调
      handleAddSuccess(){
        // 关闭dialog
        this.addUserDialogVisible = false;
        // 获取最新数据
        this.getUserList();
      },
      // 获取角色列表
      async getRoleList(){
        const { data } = await this.$http.get('/role/list');
        this.roles = data;
      },
      // 编辑
      handleEdit(row){
        const { id, name, avatar, role_id } = row;
        this.editInfo = {
          id,
          name,
          avatar,
          role_id
        }
        this.getRoleList();
        // 打开dialog
        this.editDialogVisible = true;
      },
      // 图片上传
      handleAvatarSuccess(res) {
        this.editInfo.avatar = 'http://' + res.Location;
      },
      // 修改用户信息
      async handleUpdate(){
        const info = {
          name: this.editInfo.name,
          avatar: this.editInfo.avatar,
          role_id: this.editInfo.role_id
        }
        const { data, status } = await this.$http.put(`/users/update/${this.editInfo.id}`, info);
        if(status !== 200) return this.$message.error(data);
        this.$message.success('修改用户信息成功~');
        // 关闭dialog
        this.editDialogVisible = false;
        // 更新数据
        this.getUserList();
      }
    },
    components: { Pagination, Register }
  }
</script>

<style lang="less" scoped>
.el-dialog{
  .title{
    font-size: 18px;
    font-weight: 500;
    text-align: center;
  }
  .avatar-uploader {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width:100px;
      height:100px;
      line-height:100px;
      text-align: center;
    }
    .avatar {
      width:100px;
      height:100px;
      display: block;
    }
  }
}
</style>