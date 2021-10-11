<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>更改商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="更改商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>

      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
        style="margin: 15px 0"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="editForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="editForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="editForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cate">
              <el-cascader
                v-model="editForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">配置管理</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">定时任务补偿</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      cateList: [],
      activeIndex: 0,
      editForm: {},
      editFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cate: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleChange() {
      if (this.editForm.goods_cat.length != 3) {
        this.editForm.goods_cat = [];
      }
    },

    beforeTabLeave(activeName, oldActiveName){
        if(oldActiveName == 0 && this.editForm.goods_cat.length!=3){
            this.$message.error('请选择商品分类');
            return false;
        }
    },

    async tabClicked(){
        if(this.activeName == '1'){
           const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{sel:'only'});
           if(res.meta.status!=200) return this.$message.error('获取动态参数失败');
        }
    }
  },
  computed: {
      cateId(){
          if(this.goods_cat.length == 3){
              return this.goods_cat[2];
          }
          return null;
      }
  },
  async created() {
    const { data: res } = await this.$http.get(
      `goods/${this.$route.params.id}`
    );
    if (res.meta.status != 200) return this.$message.error("获取商品失败");
    res.data.goods_cat = res.data.goods_cat.split(',').map(Number);
    this.editForm = res.data;
    console.log(this.editForm);
    this.$message.success("获取商品成功");

    const { data: cate } = await this.$http.get("categories");
    if (cate.meta.status != 200) return this.$message.error("获取商品分类失败");
    this.cateList = cate.data;
    this.$message.success("获取商品分类成功");
  },
};
</script>