<template>
  <div class="goods">
    <el-card>
      <!-- 搜索和添加商品区域 -->
      <el-row type="flex" align="middle" :gutter="10">
        <el-col :span="6">
          <el-input 
            v-model="params.query_params" 
            size="mini" 
            placeholder="请输入内容" 
            clearable 
            @clear="getGoodsList"
            @blur="getGoodsList"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="getGoodsList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="2"><el-button type="primary" size="mini" @click="handleAdd">添加商品</el-button></el-col>
      </el-row>
      
      <!-- 表格区域 -->
      <el-table stripe border size="small" v-loading="loading" :data="list">
        <el-table-column type="expand" >
          <template #default='scope'>
            <el-collapse v-model="activeNames" accordion>
              <el-collapse-item title="版本" name="1">
                <el-table :data="scope.row.versions" border size="mini">
                  <el-table-column align="center" label="版本名称" prop="name"></el-table-column>
                  <el-table-column align="center" label="版本价格" prop="price"></el-table-column>
                </el-table>
              </el-collapse-item>
              <el-collapse-item title="颜色" name="2">
                <el-row :gutter="20">
                  <el-col :span="2" v-for="(item, index) in scope.row.colors" :key="index">
                    <el-tag size="small">{{item}}</el-tag>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="封面图片" name="3">
                <el-card shadow="never">
                  <div v-if="!scope.row.cover">无</div>
                <div v-else>
                  <el-image
                    style="width: 100px; height: 100px;"
                    :src="scope.row.cover"
                    :preview-src-list="[scope.row.cover]"
                    fit="contain"></el-image>
                  <div>（ 点击预览大图 ）</div>
                </div>
                </el-card>
              </el-collapse-item>
              <el-collapse-item title="主要图片" name="4">
                <el-card shadow="never">
                  <el-row :gutter="20">
                    <el-col :xs="8" :sm="6" :md="4" v-for="(url, index) in scope.row.imgArr" :key="index" style="text-align: center">
                      <el-image
                        style="width: 100px; height: 100px;"
                        :src="url"
                        :preview-src-list="scope.row.imgArr"
                        fit="contain"></el-image>
                    </el-col>
                  </el-row>
                  <div>（ 点击预览大图 ）</div>
                </el-card>
              </el-collapse-item>
              <el-collapse-item title="描述" name="5">
                <el-card shadow="never">
                  <div v-html="scope.row.detail"></div>
                </el-card>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="商品名称" align="center" prop="name"></el-table-column>
        <el-table-column label="商品描述" align="center" prop="goods_desc"></el-table-column>
        <el-table-column label="价格" align="center" prop="price"></el-table-column>
        <el-table-column label="分类" align="center" prop="category_name"></el-table-column>
        <el-table-column label="状态" align="center" prop="is_status" >
          <template #default="scope">
            <el-tag size="small" :type="scope.row.is_status | typeName">{{scope.row.is_status | state}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260">
          <template #default="scope">
            <popover style="margin-right: 10px;" :is_status="scope.row.is_status" :id="scope.row.id" @getGoodsList="getGoodsList" />
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

      <el-dialog 
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        @close="handleDialogClose"
        width="700px"
        top="10vh">
        <template #title>
          <div class="title">{{is_edit ? '修改商品信息' : '添加商品'}}</div>
        </template>
        <add 
          :goodsInfo="currentInfo" 
          :is_edit="is_edit"
          @handleAddGoods="handleAddGoods"
          @handleUpdateGoods="handleUpdateGoods"/>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import Pagination from '../../components/pagination/Pagination.vue';
import Add from './children/Add.vue';
import Popover from './children/Popover.vue';
  export default {
    components: { Pagination, Add, Popover },
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
        // 商品列表
        list: [],
        // loading开关
        loading: false,
        // 列表总条数
        total: 0,
        activeNames: '1',
        // dialog开关
        dialogVisible: false,
        // 当前是否为编辑
        is_edit: false,
        // 当前编辑的商品信息
        currentInfo: {},
        // 修改状态的开关
        visible: false
      }
    },
    created(){
      // 获取商品列表数据
      this.getGoodsList();
    },
    methods: {
      // 获取商品列表数据
      async getGoodsList(){
        // 打开loading
        this.loading = true;
        const{ data, status } = await this.$http.get('/goods/list', { params: this.params });
        // 判断是否成功
        if(status !== 200) return this.$message.error(data);
        // 成功就保存到list
        this.list = data.goods;
        this.total = data.total;
        // 关闭loading
        this.loading = false;
      },
      // pageSize 改变时会触发
      handleSizeChange(size){
        // 修改每页条数
        this.params.current_number = size;

        // 重新请求数据
        this.getGoodsList();
      },
      // currentPage 改变时会触发
      handleCurrentChange(num){
        // 修改页码
        this.params.page_number = num;

        // 重新请求数据
        this.getGoodsList();
      },
      // 添加
      handleAdd(){
        // 打开dialog
        this.dialogVisible = true;
        // 初始化数据
        this.currentInfo = {
          category_id: null,
          name: '',
          goods_desc: '',
          price: 0,
          inventory: 0,
          colors: [],
          detail: '',
          imgArr: [],
          versions: []
        };
      },
      // 编辑
      handleEdit(row){
        this.currentInfo = row;
        // 打开dialog
        this.is_edit = true;
        this.dialogVisible = true;
      },
      // 删除
      handleDelete(row){
        const { id, name } = row;
        this.$confirm(`此操作将永久删除该商品'${name}', 是否继续?`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data, status } = await this.$http.delete(`/goods/delete/${id}`);
          if(status !== 200) return this.$message.error(data);
          this.$message.success('删除成功!');
          // 重新获取数据
          this.params.page_number = 1;
          this.getGoodsList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // dialog关闭回调
      handleDialogClose(){
        this.is_edit = false;
      },
      // 添加商品方法
      async handleAddGoods(info){
        // 发起请求
        const { data, status } = await this.$http.post('goods/add', info);
        if(status !== 201) return this.$message.error(data);
        this.$message.success('添加成功');
        // 关闭dialog
        this.dialogVisible = false;
        // 刷新数据
        this.getGoodsList();
      },
      // 修改商品信息方法
      async handleUpdateGoods(info){
        // 当前修改的商品id
        const id = this.currentInfo.id;
        // 发起请求
        const { data, status } = await this.$http.put(`goods/update/${id}`, info);
        if(status !== 200) return this.$message.error(data);
        this.$message.success('修改成功');
        // 关闭dialog
        this.dialogVisible = false;
        // 刷新数据
        this.getGoodsList();
      }
    },
    filters: {
      state(value){
        return value === 0 ? '下架' : value === 1 ? '在售' : '售罄';
      },
      typeName(value){
        return value === 0 ? 'danger' : value === 1 ? 'success' : 'warning';
      }
    }
  }
</script>

<style lang="less" scoped>
.goods{
  .el-card{
    .el-collapse{
      .el-row{
        .el-col{
          margin: 5px 0;
        }
      }
    }
    .el-dialog{
      height: 80vh;
      .title{
        font-size: 18px;
        font-weight: 500;
        text-align: center;
      }
    }
  }
}
</style>