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
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
        >
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
            <el-form-item label="商品分类">
              <el-cascader
                v-model="editForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
                disabled
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(data, index) in item.attr_vals"
                  :key="index"
                  :label="data"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"> </el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="imgList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="editForm.goods_introduce"
            ></quill-editor>
            <el-button type="primary" style="margin-top: 15px" @click="edit"
              >更新商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
      title="图片预览"
      :visible.sync="picPreviewDialogVisible"
      width="50%"
    >
      <img :src="previewPath" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
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
      },
      manyTableData: [],
      onlyTableData: [],
      pics: [],
      imgList: [],
      picPreviewDialogVisible: false,
      previewPath: "",
    };
  },
  methods: {
    handleChange() {
      if (this.editForm.goods_cat.length != 3) {
        this.editForm.goods_cat = [];
      }
    },

    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName == 0 && this.editForm.goods_cat.length != 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },

    getPicures() {
      this.editForm.pics.forEach((item) => {
        this.imgList.push({ name: item.pics_id, url: item.pics_big_url });
      });
      console.log(this.imgList);
    },

    handlePreview(file) {
      if (file.response) {
        this.previewPath = file.response.data.url;
      } else {
        this.previewPath = file.url;
      }
      this.picPreviewDialogVisible = true;
    },
    handleRemove(file) {
      if (file.response) {
        const filePath = file.response.data.tmp_path;
        const i = this.pics.findIndex((x) => x.pic == filePath);
        this.pics.splice(i, 1);
      }
      console.log(this.pics);
    },
    handleSuccess(response) {
      this.pics.push({ pic: response.data.tmp_path });
      console.log(this.pics);
    },

    edit() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          const attribute = [];
          this.manyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(","),
            };
            attribute.push(newInfo);
          });

          this.onlyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            };
            attribute.push(newInfo);
          });

          const form = {
            goods_name: this.editForm.goods_name,
            goods_price: this.editForm.goods_price,
            goods_number: this.editForm.goods_number,
            goods_weight: this.editForm.goods_weight,
            goods_introduce: this.editForm.goods_introduce,
            attrs: attribute,
            pics: this.pics
          };
          console.log(form);
          const { data: res } = await this.$http.put(
            `goods/${this.$route.params.id}`,
            form
          );

          console.log(res.meta.status);
          if (res.meta.status != 201)
            return this.$message.error("更改商品失败");
          this.$message.success("更改商品成功");
          this.$router.push("/goods");
        } else {
          return this.$message("请填写必要项");
        }
      });
    },
  },
  computed: {
    cateId() {
      if (this.editForm.goods_cat.length == 3) {
        return this.editForm.goods_cat[2];
      }
      return null;
    },
  },
  async created() {
    const { data: res } = await this.$http.get(
      `goods/${this.$route.params.id}`
    );
    if (res.meta.status != 200) return this.$message.error("获取商品失败");
    res.data.goods_cat = res.data.goods_cat.split(",").map(Number);
    res.data.attrs.forEach((item) => {
      if (item.attr_sel == "many") {
        item.attr_vals =
          item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
        this.manyTableData.push(item);
      } else {
        this.onlyTableData.push(item);
      }
    });
    this.editForm = res.data;
    console.log(this.editForm);
    this.$message.success("获取商品成功");

    const { data: cate } = await this.$http.get("categories");
    if (cate.meta.status != 200) return this.$message.error("获取商品分类失败");
    this.cateList = cate.data;
    this.$message.success("获取商品分类成功");
    this.getPicures();
  },
};
</script>

<style scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
</style>