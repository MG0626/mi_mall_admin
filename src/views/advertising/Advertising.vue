<template>
  <div class="advertising">
    <el-card>
      <!-- 添加区域 -->
      <el-row>
        <el-col ><el-button type="primary" size="mini" @click="handleOpenDialog">添加推广</el-button></el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="list" stripe border size="small" v-loading="loading" >
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" align="center"></el-table-column>
        <el-table-column label="推广图片" prop="url" align="center">
          <template #default="scope">
            <el-button type="text" size="mini" @click="handleOpenImage(scope.row.url)">点击查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="is_status" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.is_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitchChange($event, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="mini" type="primary" round icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" round icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加推广dialog -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="is_edit ? '编辑' : '添加'"
      width="30%"
      @close="handleDialogClose">
      <el-form :model="info" :rules="rules" ref="add">
        <el-form-item label="推广图片" label-width="80px" prop="url">
          <el-upload
            ref="upload"
            :action="$http.defaults.baseURL + '/upload/advertising/image'"
            :headers="headers"
            :on-success="handleSuccess">
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
          <div style="margin-top: 15px" v-if="info.url">
            <el-image
              style="width: 100px; height: 100px;"
              :src="info.url"
              :preview-src-list="[info.url]"
              fit="contain"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="选择商品" label-width="80px" prop="goods_id">
          <el-cascader
            v-model="value"
            size="mini"
            :options="goodsTree"
            :props="props"
            @change="handleCascaderChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleConfirm">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 查看图片的dialog -->
    <el-dialog 
      :visible.sync="imageVisible"
      title="查看推广图片"
      top="5vh"
      width="50%"
      @close="() => currentImgUrl = ''">
      <img :src="currentImgUrl" width="100%" height="100%" />  
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        // loading开关
        loading: false,
        // 推广列表
        list: [],
        // 当前打开查看的图片地址
        currentImgUrl: '',
        // 查看图片的dialog开关
        imageVisible: false,
        // 添加或编辑推广dailog开关
        dialogVisible: false,
        // 图片上传的请求头
        headers: {
          Authorization: this.$store.state.token
        },
        // 商品列表树
        goodsTree: [],
        // 级联选择器配置
        props: { 
          value: 'id',
          label: 'name',
          expandTrigger: 'hover' 
        },
        // 级联选择器选中的值
        value: [],
        // 添加的推广信息
        info: {
          url: '',
          goods_id: ''
        },
        // 添加推广form验证规则
        rules: {
          url: { required: true, message: '请上传推广图片', trigger: 'blur' },
          goods_id: { required: true, message: '请选择商品', trigger: 'blur' }
        },
        // 编辑开关
        is_edit: false,
        // 当前编辑的id
        current_id: 0
      }
    },
    created(){
      // 获取推广列表
      this.getAdvertisingList();
    },
    methods: {
      // 获取推广列表
      async getAdvertisingList(){
        // 打开loading
        this.loading = true;
        const { data } = await this.$http.get('/advertising/list');
        // 保存
        this.list = data;
        // 关闭loading
        this.loading = false;
      },
      // 打开添加推广dialog
      async handleOpenDialog(){
        // 获取按分类分组的商品列表树
        const { data, status } = await this.$http.get('/goods/list/tree');
        if(status !== 200) return this.$message.error(data);
        // 保存
        this.goodsTree = data;
        // 打开dialog
        this.dialogVisible = true;
      },
      // 打开查看图片
      handleOpenImage(url){
        // 保存图片地址
        this.currentImgUrl = url;
        // 打开dialog
        this.imageVisible = true;
      },
      // 修改状态触发
      async handleSwitchChange(value, row){
        // 发起请求
        const { data, status } = await this.$http.put(`advertising/status/${row.id}`, { is_status: value });
        if(status !== 200) {
          row.is_status = !value;
          return this.$message.error(data);
        }
        this.$message.success('修改成功');
      },
      // 关闭添加推广的dialog
      handleDialogClose(){
        // 清空数据
        this.info.url = '';
        this.info.goods_id = '';
        this.value = [];
        // 关闭编辑
        this.is_edit = false;
        // 清空上传列表
        this.$refs.upload.clearFiles();
      },
      // 图片上传成功时的钩子
      handleSuccess(response){
        // 图片路径
        const path = `http://${response.Location}`;
        this.info.url = path;
      },
      // 级联选择器选中时回调
      handleCascaderChange(value){
        // 获取商品id
        const id = value[value.length - 1];
        // 保存到info中
        this.info.goods_id = id;
      },
      // 添加推广
      handleAddAdvertising(){
        this.$refs.add.validate(async (valid) => {
          if (valid) {
            const { data, status } = await this.$http.post('/advertising/add', this.info);
            if(status !== 201) return this.$message.error(data);
            this.$message.success('添加推广成功');
            // 获取新数据
            this.getAdvertisingList();
            // 关闭dialog
            this.dialogVisible = false;
          } else {
            return false;
          }
        });
      },
      // 编辑
      handleEdit(row){
        // 获取数据
        const { id, url, goods_id, category_id } = row;
        // 保存当前编辑的id
        this.current_id = id;
        // 替换数据
        this.info.url = url;
        this.info.goods_id = goods_id;
        this.value = [category_id, goods_id];

        // 打开dialog
        this.is_edit = true;
        this.handleOpenDialog();
      },
      // 编辑推广信息
      handleUpdateAdvertising(){
        this.$refs.add.validate(async (valid) => {
          if (valid) {
            const { data, status } = await this.$http.put(`/advertising/update/${this.current_id}`, this.info);
            if(status !== 200) return this.$message.error(data);
            this.$message.success('修改成功');
            // 获取新数据
            this.getAdvertisingList();
            // 关闭dialog
            this.dialogVisible = false;
          } else {
            return false;
          }
        });
      },
      // dialog点击确定事件
      handleConfirm(){
        // 判断当前是否为编辑
        if (this.is_edit) {
          // 编辑
          this.handleUpdateAdvertising();
        }else{
          // 添加推广
          this.handleAddAdvertising();
        }
      },
      // 删除
      handleDelete(row){
        const { id, goods_name } = row;
        this.$confirm(`此操作将永久删除该推广'${goods_name}', 是否继续?`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data, status } = await this.$http.delete(`/advertising/delete/${id}`);
          if(status !== 200) return this.$message.error(data);
          this.$message.success('删除成功!');
          // 重新获取数据
          this.getAdvertisingList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    }
  }
</script>

<style lang="less" scoped>

</style>