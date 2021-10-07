<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="roleList" stripe style="width: 100%" border>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1, it1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', 'vcenter', it1 === 0 ? 'bdtop' : '']"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, it2) in item1.children"
                  :key="item2.id"
                  :class="['vcenter', it2 === 0 ? '' : 'bdtop']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="更改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="clearDef"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      dialogVisible: false,
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      addRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },

      editDialogVisible: false,
      editForm: {},
      editRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },

      setRightDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      defKeys: [],
      roleId:'',
    };
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
      console.log(this.roleList);
      this.$message.success("获取角色列表成功");
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          this.dialogVisible = false;
          const { data: res } = await this.$http.post("roles", this.addForm);
          if (res.meta.status != 201)
            return this.$message.error("创建角色失败");
          this.$message.success("创建角色成功");
          this.getRoleList();
        } else {
          return;
        }
      });
    },
    async showEditDialog(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status != 200) return this.$message.error("获取该角色失败");
      this.editForm = res.data;
      this.$message.success("获取该角色成功");
    },
    editRole() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(
            `roles/${this.editForm.roleId}`,
            {
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc,
            }
          );
          if (res.meta.status != 200)
            return this.$message.error("更改该角色失败");
          this.$message.success("更改该角色成功");
          this.editDialogVisible = false;
          this.getRoleList();
        } else {
          return;
        }
      });
    },
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      ).catch((err) => err);

      if (confirmResult == "confirm") {
        const { data: res } = await this.$http.delete(`roles/${id}`);
        if (res.meta.status != 200) this.$message.error("删除用户失败");
        this.$message.success("删除用户成功");
        this.getRoleList();
      } else {
        this.$message.info("已取消删除");
      }
    },
    async removeRightById(role, rightId) {
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
          `roles/${role.id}/rights/${rightId}`
        );

        if (res.meta.status != 200) return this.$message.error("删除权限失败");

        this.$message.success("删除权限成功");

        role.children = res.data;
      }

      this.$message.info("取消删除");
    },
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200)
        return this.$message.error("获取权限列表失败");
      this.$message.success("获取权限列表成功");
      this.rightsList = res.data;
      console.log(this.rightsList);
      this.getLeafKeys(role, this.defKeys);

      this.setRightDialogVisible = true;
    },

    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },

    clearDef(){
      this.defKeys = [];
    },
    async allotRights(){
      const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
      const idStr = keys.join(',');
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
      if(res.meta.status !=200) return this.$message.error('分配权限失败');
      this.$message.success('分配权限成功')
      this.getRoleList();
      this.setRightDialogVisible = false
    }
  },
  created() {
    this.getRoleList();
  },
};
</script>

<style scoped>
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>