<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row style="margin: 15px 0">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            style="margin-left: 10px"
            v-model="selectedCateKey"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="openEditDialog(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="openEditDialog(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="activeName === 'many' ? '添加动态参数' : '添加静态属性'"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="activeName === 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="activeName === 'many' ? '更改动态参数' : '更改静态属性'"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="activeName === 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addForm: {
        attr_name: "",
      },

      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      addDialogVisible: false,

      editForm: {},

      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      editDialogVisible: false,
      cateList: [],

      selectedCateKey: [],

      cateProps: {
        children: "children",
        label: "cat_name",
        value: "cat_id",
        expandTrigger: "hover",
      },

      activeName: "many",

      manyTableData: [],
      onlyTableData: [],
    };
  },

  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200)
        return this.$message.error("获取分类列表失败");

      this.cateList = res.data;
      console.log(this.cateList);
    },

    handleChange() {
      if (this.selectedCateKey.length !== 3) {
        this.selectedCateKey = [];
        return;
      }

      this.getParamsData();
    },

    async getParamsData() {
      const { data: res } = await this.$http(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status != 200)
        return this.$message.error("获取参数列表失败");

      console.log(res.data);
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },

    handleTabClick() {
      this.getParamsData();
    },

    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
      this.editForm = {};
    },
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `categories/${this.cateId}/attributes`,
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName,
            }
          );
          if (res.meta.status != 201)
            return this.$message.error("创建参数失败");
          this.addDialogVisible = false;
          this.$message.success("创建参数成功");
          this.getParamsData();
        } else {
          return;
        }
      });
    },

    async openEditDialog(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status != 200) return this.$message.error("获取参数失败");

      this.editForm = res.data;
    },

    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName,
            }
          );

          if (res.meta.status != 200)
            return this.$message.error("更改参数失败");
          this.$message.success("更改参数成功");
          this.editDialogVisible = false;
          this.getParamsData();
        } else {
          return;
        }
      });
    },

    async deleteParams(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult == "confirm") {
        const { data: res } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${id}`
        );
        if (res.meta.status != 200) return this.$message.error("删除参数失败");
        this.$message.success("删除参数成功");
        this.getParamsData();
      } else {
        this.$message.info("已取消删除");
      }
    },
  },

  computed: {
    isBtnDisabled() {
      if (this.selectedCateKey.length !== 3) {
        return true;
      } else {
        return false;
      }
    },

    cateId() {
      if (this.selectedCateKey.length === 3) {
        return this.selectedCateKey[2];
      }

      return null;
    },
  },

  created() {
    this.getCateList();
  },
};
</script>