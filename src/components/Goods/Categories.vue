<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table style="margin-top:15px"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isOk" scope="scope">
          <i
            v-if="scope.row.cat_deleted == false"
            class="el-icon-success"
            style="color: lightgreen"
          ></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>

        <template slot="order" scope="scope">
          <el-tag v-if="scope.row.cat_level == 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level == 1"
            size="mini"
            type="success"
            >二级</el-tag
          >
          <el-tag
            v-else-if="scope.row.cat_level == 2"
            size="mini"
            type="warning"
            >三级</el-tag
          >
        </template>

        <template slot="opt" scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        pagesize: 5,
        pagenum: 1,
      },
      catelist: [],
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
    };
  },
  methods: {
    async getCategories() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200)
        return this.$message.error("获取分类列表失败");
      this.catelist = res.data.result;
      this.total = res.data.total;
      console.log(this.catelist);
      this.$message.success("获取分类列表成功");
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCategories();
    },

    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCategories();
    },
  },
  created() {
    this.getCategories();
  },
};
</script>

