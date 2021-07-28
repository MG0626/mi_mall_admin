<template>
  <div class="permission">
    <el-card>
      <!-- 添加权限区域 -->
      <el-row>
        <el-col><el-button type="primary" size="mini" @click="dialogVisible = true">添加权限</el-button></el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table 
        stripe 
        border 
        size="small" 
        v-loading="loading" 
        :data="list" 
        row-key="id"
        :tree-props="treeProps">
        <el-table-column header-align="center" label="名称" prop="name" width="220" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="路径" prop="path"></el-table-column>
        <el-table-column align="center" label="请求方式" prop="type"></el-table-column>
        <el-table-column align="center" label="状态" prop="enable">
          <template #default="scope">
            <el-switch v-model="scope.row.enable" @change="handleSwitchChange($event, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="权限等级" prop="level">
          <template #default="scope">
            <el-tag :type="scope.row.level === 0 ? '' : scope.row.level === 1 ? 'success' : 'warning'">{{scope.row.level | level}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template #default="scope">
            <el-button size="mini" type="primary" round icon="el-icon-edit" @click="handleOpenEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" round icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加权限dialog -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      @close="handleDialogClose">
      <template #title>
        <div class="title">{{isEdit ? '修改权限信息' : '添加权限信息'}}</div>
      </template>
      <!-- 内容区域 -->
      <el-form :model="info" label-position="right" :rules="rules" ref="ruleForm">
        <el-form-item label-width="80px" label="权限名称" prop="name">
          <el-input v-model="info.name" />
        </el-form-item>
        <el-form-item label-width="80px" label="路径" prop="path">
          <el-input v-model="info.path" />
        </el-form-item>
        <el-form-item label-width="80px" label="请求类型" prop="type">
          <el-input v-model="info.type" />
        </el-form-item>
        <el-form-item label-width="80px" label="父级" prop="parent_id">
          <el-cascader
            v-model="value"
            :options="cascaderList"
            :props="props"
            :show-all-levels="false"
            :key="cascaderKey"
            @change="handleChange"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label-width="80px" label="级别" prop="level">
          <el-select v-model="info.level" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="handleAddOrEdit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        // dialog开关
        dialogVisible: false,
        // loading开关
        loading: false,
        // 权限列表
        list: [],
        // 表格渲染嵌套数据的配置选项
        treeProps: {
          children: 'children'
        },
        // 修改的信息
        info: {
          name: "",
          path: "",
          type: "",
          parent_id: 0,
          enable: 1,
          level: 2
        },
        // 修改的信息验证规则
        rules: {
          name: [
            { required: true, message: '请输入权限名称', trigger: 'blur' }
          ],
          path: [
            { required: true, message: '请输入权限路径', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请输入请求类型', trigger: 'blur' }
          ],
          parent_id: [
            { required: true, message: '请选择父级', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '请输入权限级别', trigger: 'blur' }
          ]
        },
        // 权限级别
        options: [
          {
            value: 0,
            label: '一级'
          },
          {
            value: 1,
            label: '二级'
          },
          {
            value: 2,
            label: '三级'
          }
        ],
        // 级联选择器key
        cascaderKey: 0,
        // 级联选择器配置
        props: {
          value: 'id',
          label: 'name',
          checkStrictly: true
        },
        // 级联选中项
        value: [0],
        // 编辑开关
        isEdit: false,
        // 当前编辑的权限id
        currentId: 0
      }
    },
    created(){
      this.getPermissionList();
    },
    methods: {
      // 获取权限列表
      async getPermissionList(){
        // 打开loading
        this.loading = true;
        const { data, status } = await this.$http.get('/permission/list');
        // 判断是否成功
        if(status !== 200) return this.$message.error(data);
        this.list = data;
        // 关闭loading
        this.loading = false;
      },
      // 修改权限状态
      async handleSwitchChange(value, row){
        // 格式化布尔值
        const newValue = Number(value);
        // 发起请求
        const { data, status } = await this.$http.put(`/permission/status/${row.id}`, { 'enable': newValue });
        if(status !== 200) {
          row.enable = !value;
          return this.$message.error(data);
        }
        this.$message.success('修改用户状态成功~');
        // 刷新数据
        this.getPermissionList();
      },
      // 关闭dialog
      handleDialogClose(){
        // 关闭dialog
        this.dialogVisible = false;
        // 关闭编辑
        this.isEdit = false;
        // 清空数据
        this.info = {
          name: "",
          path: "",
          type: "",
          parent_id: 0,
          enable: 1,
          level: 2
        }
      },
      // 打开编辑dialog
      handleOpenEdit(row){
        // 获取数据
        const { id, name, path, type, parent_id, enable, level } = row;
        // 填充数据
        this.info = {
          name,
          path,
          type,
          parent_id,
          enable,
          level
        }
        this.currentId = id;
        // 打开dialog
        this.isEdit = true;
        this.dialogVisible = true;
      },
      // 编辑
      async handleEdit(){
        const { data, status } = await this.$http.put(`/permission/update/${this.currentId}`, this.info);
        if(status !== 200) return this.$message.error(data);
        this.$message.success('修改成功!');
        // 重新获取数据
        this.getPermissionList();
        // 关闭dialog
        this.handleDialogClose();
      },
      // 删除
      handleDelete(row){
        // 获取id，名称
        const { id, name } = row;
        this.$confirm(`此操作将永久删除该权限'${name}', 是否继续?`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data, status } = await this.$http.delete(`/permission/delete/${id}`);
          if(status !== 200) return this.$message.error(data);
          this.$message.success('删除成功!');
          // 重新获取数据
          this.getPermissionList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 级联选择器选中后触发
      handleChange(value){
        // 选中id
        const id = value[value.length - 1];
        // 保存
        this.info.parent_id = id;
      },
      // 添加或编辑权限
      handleAddOrEdit(){
        // 判断当前是不是编辑
        if(this.isEdit){
          this.handleEdit();
          return ;
        }
        // 验证是否通过
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            // 发起网络请求
            const { data, status } = await this.$http.post('/permission/add', this.info);
            if(status !== 201) return this.$message.error(data);
            // 关闭dialog
            this.dialogVisible = false;
            // 提示
            this.$message.success('权限添加成功！');
            // 刷新数据
            this.getPermissionList();
          }
        });
      }
    },
    filters: {
      level(value){
        let level = '一级';
        if(value !== 0){
          level = value === 1 ? '二级' : '三级';
        }
        return level;
      }
    },
    watch: {
      // 让级联选择器重新渲染
      cascaderList(newVal) {
        this.cascaderKey++ //只要监听到数据源发生变化 ，改变cascaderKey的值，达到重新渲染的效果
      }
    },
    computed: {
      cascaderList(){
        const list = JSON.parse(JSON.stringify(this.list))
        // 删除第三级
        list.forEach(v => {
          v.children && v.children.forEach(item => {
            delete item.children;
          })
        })
        return [
          {
            id: 0,
            name: "/",
            path: null,
            type: null,
            parent_name: null,
            parent_id: null,
            enable: 1,
            level: 0,
            children: list
          }
        ]
      }
    }
  }
</script>

<style lang="less" scoped>
.permission{
  .el-dialog{
    .title{
      font-size: 18px;
      font-weight: 500;
      text-align: center;
    }
  }
}
</style>