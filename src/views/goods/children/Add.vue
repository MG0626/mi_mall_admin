<template>
  <div class="add">
    <el-tabs v-model="activeName" tab-position="left">
      <el-tab-pane label="选择分类" name="category">
        <div class="title">商品分类</div>
        <el-select v-model="info.category_id" placeholder="请选择">
          <el-option
            v-for="item in categorys"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-tab-pane>
      <el-tab-pane label="基本信息" name="goods_info">
        <el-form :model="info" label-position="top">
          <el-form-item label="商品名称" prop="name">
            <el-input  v-model="info.name" placeholder="请输入商品名称" size="small"/>
          </el-form-item>
          <el-form-item label="商品描述" prop="goods_desc">
            <el-input  v-model="info.goods_desc" placeholder="请输入商品描述" size="small"/>
          </el-form-item>
          <el-form-item label="商品价格（按版本最低价格）" prop="price">
            <el-input-number v-model="info.price" :precision="2" :step="0.1" :min="0" size="small"></el-input-number>
          </el-form-item>
          <el-form-item label="商品库存" prop="inventory">
            <el-input-number v-model="info.inventory" :precision="0" :min="0"  size="small"></el-input-number>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="params">
        <el-row>
          <el-col>
            <div>版本</div>
            <el-table :data="info.versions" border size="mini">
              <el-table-column align="center" label="版本名称" prop="name"></el-table-column>
              <el-table-column align="center" label="版本价格" prop="price"></el-table-column>
              <el-table-column
                align="center"
                label="操作">
                <template #default="scope">
                  <el-button 
                    type="danger" 
                    icon="el-icon-delete" 
                    circle 
                    size="mini"
                    @click.native.prevent="deleteVersion(scope.$index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 15px">
              <el-popover
                placement="right"
                title="添加版本"
                width="240"
                v-model="popoverVisible"
                trigger="manual">
                <el-form ref="versions" :model="versions" label-position="right" :rules="versionsRule">
                  <el-form-item label-width="80px" prop="name" label="版本名称">
                    <el-input v-model="versions.name" size="small"></el-input>
                  </el-form-item>
                  <el-form-item label-width="80px" prop="price" label="版本价格">
                    <el-input-number v-model="versions.price" :precision="2" :step="0.1" :min="0" size="small"></el-input-number>
                  </el-form-item>
                </el-form>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" @click="popoverVisible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleAddVersion">确定</el-button>
                </div>
                <template #reference>
                  <el-button size="mini" @click="popoverVisible = true">添加版本</el-button>
                </template>
              </el-popover>
            </div>
          </el-col>
          <el-col>
            <div class="title">颜色</div>
            <el-row>
              <el-col :span="4" v-for="(item, index) in info.colors" :key="index">
                <el-tag size="medium" closable @close="handleClose(index)">{{item}}</el-tag>
              </el-col>
              <el-col :span="4">
                <el-input
                  class="input-new-tag"
                  v-if="colorVisible"
                  v-model="colorValue"
                  ref="color"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="mini" @click="showInput">添加颜色</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="images">
        <div class="title">封面图片</div>
        <div class="cover">
          <el-upload
            :action="$http.defaults.baseURL + '/upload/images?parentName=' + info.name"
            :headers="headers"
            :show-file-list="false"
            :before-upload="handleBeforeUpload"
            :on-remove="() => info.cover = ''"
            :on-success="(response) => handleSuccess(response, 'cover')">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-image
            style="width: 100px; height: 100px;margin-top: 15px"
            v-if="info.cover"
            :src="info.cover"
            :preview-src-list="[info.cover]"
            fit="contain">
          </el-image>
          <div style="font-size: 12px;margin: 10px 0">（ 点击预览大图 ）</div>
        </div>
        <div class="title">主要图片</div>
        <el-upload
          :action="$http.defaults.baseURL + '/upload/images?parentName=' + info.name"
          :headers="headers"
          :file-list="imgArr"
          :before-upload="handleBeforeUpload"
          :on-remove="handleRemove"
          :on-success="handleSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <div style="font-size: 12px;margin: 10px 0">（ 点击预览大图 ）</div>
        <el-row :gutter="20" style="padding-bottom: 30px;">
          <el-col :span="6" v-for="(url, index) in info.imgArr" :key="index" style="text-align: center">
            <el-image
              style="width: 100px; height: 100px;"
              :src="url"
              :preview-src-list="info.imgArr"
              fit="contain"></el-image>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="商品描述" name="desc">
        <div id="editor"></div>
      </el-tab-pane>
      <el-tab-pane label="检查" name="check">
        <el-row>
          <el-col>
            <div>商品分类</div>
            <div class="text" v-if="info.category_id === 0">无</div>
            <div class="text">{{category_name}}</div>
          </el-col>
          <el-col>
            <div>商品名称</div>
            <div class="text" v-if="info.name === ''">无</div>
            <div class="text">{{info.name}}</div>
          </el-col>
          <el-col>
            <div>商品描述</div>
            <div class="text" v-if="info.goods_desc === ''">无</div>
            <div class="text">{{ info.goods_desc }}</div>
          </el-col>
          <el-col>
            <div>商品价格</div>
            <div class="text">{{info.price}}</div>
          </el-col>
          <el-col>
            <div>商品库存</div>
            <div class="text">{{info.inventory}}</div>
          </el-col>
          <el-col>
            <div>版本</div>
            <el-row>
              <el-col v-if="info.versions.length === 0">无</el-col>
              <el-col>
                <el-table :data="info.versions" border size="mini">
                  <el-table-column align="center" label="版本名称" prop="name"></el-table-column>
                  <el-table-column align="center" label="版本价格" prop="price"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-col>
          <el-col>
            <div>颜色</div>
            <el-row class="text">
              <el-col v-if="info.colors.length === 0">无</el-col>
              <el-col :span="2" v-for="(item, index) in info.colors" :key="index">
                <el-tag size="medium">{{item}}</el-tag>
              </el-col>
            </el-row>
          </el-col>
          <el-col>
            <div>封面图片</div>
            <el-row :gutter="20" class="text">
              <el-col v-if="!info.cover">无</el-col>
              <el-col v-else>
                <el-image
                  style="width: 100px; height: 100px;"
                  :src="info.cover"
                  :preview-src-list="[info.cover]"
                  fit="contain"></el-image>
              </el-col>
            </el-row>
          </el-col>
          <el-col>
            <div>主要图片</div>
            <el-row :gutter="20" class="text">
              <el-col v-if="info.imgArr.length === 0">无</el-col>
              <el-col :span="6" v-for="(url, index) in info.imgArr" :key="index" style="text-align: center">
                <el-image
                  style="width: 100px; height: 100px;"
                  :src="url"
                  :preview-src-list="info.imgArr"
                  fit="contain"></el-image>
              </el-col>
            </el-row>
          </el-col>
          <el-col>
            <div>商品描述</div>
            <el-button type="text" style="margin-top: 10px;" size="small" @click="dialogVisible = true">点击查看</el-button>
          </el-col>
        </el-row>
        <div class="add-btn">
          <el-button type="primary" size="small" :disabled="checkData" @click="handleClick">确认无误，添加</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 商品描述的dialog -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="商品描述"
      center
      append-to-body
      width="700px"
      top="10vh">
      <div style="height: 60vh;overflow: hidden;">
        <div v-html="info.detail" style="height: 65vh;overflow-y: auto;"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入 wangEditor
import wangEditor from 'wangeditor';
export default {
  props:{
    // 商品编辑传递过来的信息
    goodsInfo: {
      type: Object,
      default(){
        return {}
      }
    },
    // 当前是否在编辑
    is_edit: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      // tabs当前选择的标签页
      activeName: 'category',
      // 分类列表
      categorys: [],
      // 编辑过的商品信息
      info: {
        category_id: null,
        name: '',
        price: 0,
        inventory: 0,
        colors: [],
        detail: '',
        cover: '',
        imgArr: [],
        versions: [],
        goods_desc: ''
      },
      colorValue: '',
      // popover开关
      popoverVisible: false,
      // 版本列表
      versions: {
        name: '',
        price: ''
      },
      // 添加版本form验证规则
      versionsRule: {
        name: { required: true, message: '请输入版本名称', trigger: 'blur' },
        price: { required: true, message: '请输入版本价格', trigger: 'blur' }
      },
      colorVisible: false,
      // 图片上传的请求头
      headers: {
        Authorization: this.$store.state.token
      },
      // 富文本编辑器实例对象
      editor: null,
      // 商品描述dialog开关
      dialogVisible: false,
      // 当前图片数组
      imgArr: []
    }
  },
  created(){
    // 获取分类列表
    this.getCategorys();
  },
  mounted(){
    // 添加富文本编辑器
    this.wangEditor();
  },
  methods: {
    // 获取分类列表
    async getCategorys(){
      const { data } = await this.$http.get('/category/list');
      this.categorys = data;
    },
    // 删除版本
    deleteVersion(index) {
      this.info.versions.splice(index, 1);
    },
    // 删除颜色子项
    handleClose(index) {
      this.info.colors.splice(index, 1);
    },
    // 显示输入框
    showInput() {
      this.colorVisible = true;
      this.$nextTick(_ => {
        this.$refs.color.$refs.input.focus();
      });
    },
    // 添加颜色
    handleInputConfirm() {
      let colorValue = this.colorValue;
      if (colorValue) {
        this.info.colors.push(colorValue);
      }
      this.colorVisible = false;
      this.colorValue = '';
    },
    // 添加版本
    handleAddVersion(){
      this.$refs.versions.validate((valid) => {
        if (valid) {
          // 添加到info.versions中
          this.info.versions.push(this.versions);
          // 清空缓存
          this.versions = {};
          // 关闭弹窗
          this.popoverVisible = false;
        } else {
          return false;
        }
      });
    },
    // 删除图片
    handleRemove(file, fileList) {
      // 当前图片地址
      let path = '';
      // 判断当前的file是否为之前上传的
      if (file.response) {
        path = file.response.Location;
      }else{
        path = file.url;
      }
      // 获取当前图片在imgArr中的索引
      const index = this.info.imgArr.findIndex(v => v.indexOf(path) !== -1);
      // 删除
      this.info.imgArr.splice(index, 1);
    },
    // 上传文件之前的钩子
    handleBeforeUpload() {
      // 判断是否有商品名称
      if (this.info.name.trim() !== '') return true;
      // 没有名称，弹出提示
      this.$message.error('请输入商品名称后，再添加图片');
      return false;
    },
    // 图片上传成功时的钩子
    handleSuccess(response, key='imgArr'){
      // 图片路径
      const path = `http://${response.Location}`;
      // 判断当前是封面图片，还是主要图片
      if (key === 'cover') {
        return this.info.cover = path;
      }
      // 添加到商品信息的图片数组中
      this.info.imgArr.push(path);
    },
    // 添加富文本编辑器
    wangEditor(){
      const editor = new wangEditor(`#editor`);
      // 配置 onchange 回调函数，将数据同步到 vue 中
      editor.config.onchange = (newHtml) => {
        this.info.detail = newHtml;
      }
      // 上传图片
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法

        //创建formdata对象
        const file = new FormData();
        //给formdata对象中放入数据(键值对的方式)
        file.append('file', resultFiles[0]);
        // 上传图片
        const result = await this.$http.post(`/upload/desc/images?parentName=${this.info.name}`, file);
        // 上传图片，返回结果，将图片插入到编辑器中
        insertImgFn('http://' + result.data.Location);
      }
      // 创建编辑器
      editor.create();
      
      // 保存编辑器实例对象，用于销毁
      this.editor = editor;
    },
    // 添加按钮事件
    handleClick(){
      // 发射事件回去给父组件
      // 根据is_edit判断当前是否为编辑
      if (this.is_edit) {
        // 当前为编辑
        this.$emit('handleUpdateGoods', this.info);
      }else{
        // 当前为添加
        this.$emit('handleAddGoods', this.info);
      }
    }
  },
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy();
    this.editor = null;
  },
  watch: {
    goodsInfo: {
      handler: function (value){
        // 清空上次缓存信息
        this.info = {};
        this.imgArr = [];
        this.activeName = 'category';
        // 当前为编辑模式时才执行
        if (this.is_edit) {
          const { category_id, colors, detail, cover, imgArr, inventory, name, goods_desc, price, versions } = value;
          // 判断图片数组是否为null
          if (imgArr) {
            // 当前图片数组，每一项重新转为对象，返回新数组
            const arr = imgArr.map((v, i) => {
              // 对象
              const obj = {
                id: i,
                name: v,
                url: v
              }
              return obj;
            });
            this.imgArr = arr;
          }
          // 保存数据
          this.info = {
            category_id,
            colors,
            detail,
            cover: cover ||  '',
            imgArr: imgArr || [],
            inventory,
            name,
            goods_desc,
            price,
            versions
          }
        }else{
          this.info = {
            category_id: null,
            name: '',
            goods_desc: '',
            price: 0,
            inventory: 0,
            colors: [],
            detail: '',
            cover: '',
            imgArr: [],
            versions: []
          }
        }
      },
      immediate: true
    },
    'info.detail': {
      handler: function (value) {
        // 重新设置编辑器内容
        this.$nextTick(() => {
          this.editor && this.editor.txt.html(value);
        })
      },
      immediate: true
    }
  },
  computed: {
    // 当前选中的分类名称
    category_name(){
      // 当前分类id
      const id = this.info.category_id;
      // 获取对应对象
      const obj = this.categorys.find(v => v.id === id);
      return obj ? obj.name : '无';
    },
    // 检查数据是否为空
    checkData(){
      const keys = Object.keys(this.info);
      const flag =  keys.every(key => {
        // 判断是否为数组
        if (Array.isArray(this.info[key])) {
          return this.info[key].length !== 0;
        }
        // 字符串或数字
        if (this.info[key] || this.info[key] === 0) {
          return typeof this.info[key] === 'number' ? !isNaN(this.info[key]) : this.info[key].trim() !== '';
        }
      })
      return !flag;
    }
  }
}
</script>

<style lang="less" scoped>
.add {
  height: 55vh;
  overflow: hidden;
  margin-bottom: 15px;
  .title{
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
  }
  .el-row{
    .el-col{
      margin: 5px 0;
      .text{
        margin-top: 10px;
        color: #409eff;
        font-size: 12px;
      }
    }
  }
  .el-tabs{
    .el-tab-pane {
      overflow-y: auto;
      height: 60vh;
      // 隐藏滚动条
      &::-webkit-scrollbar { width: 0 !important }
      -ms-overflow-style: none;
      overflow: -moz-scrollbars-none;

      .add-btn{
        margin: 10px 30px 30px 0;
        text-align: right;
      }
    }
  }
  img{
    display: block;
  }
}
</style>
