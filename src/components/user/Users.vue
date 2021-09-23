<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card" shadow="always">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model.trim="queryInfo.query"
            @keyup.enter.native="search"
            @clear="getUserList"
          >
            <!-- @keyup.enter这里必须加上 .native 才能生效 -->
            <!-- 下面的slot="append"其中的append表示放在后面，还可以是prepend放在前面 -->
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户数据表格 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="#" align="center"> </el-table-column>
        <el-table-column prop="username" label="姓名" align="center"> </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"> </el-table-column>
        <el-table-column prop="mobile" label="电话" align="center"> </el-table-column>
        <el-table-column prop="role_name" label="角色" align="center"> </el-table-column>
        <el-table-column label="状态" align="center">
          <!-- 作用域插槽会默认覆盖prop -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="skyblue"
              inactive-color="gray"
              @change="(index, row) => changeState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" :enterable="false">
              <el-button size="mini" type="warning" @click="showEditDialog(scope.row)">
                <i class="el-icon-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button size="mini" type="danger" @click="deleteUserById(scope.row)">
                <i class="el-icon-delete"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip content="分配权限" placement="top" :enterable="false">
              <el-button size="mini" type="info">
                <i class="el-icon-setting"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <!-- 分页导航区域 
          @size-change(pagesize改变时触发) 
          @current-change(页码发生改变时触发)
          :current-page(设置当前页码)
          :page-size(设置每页的数据条数)
          :total(设置总页数) -->
      <!-- 分页栏 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户，弹出对话框 -->
    <el-dialog title="添加用户信息" :visible.sync="dialogVisible" width="30%" @close="closeDialog">
      <el-form label-width="80px" :model="addForm" :rules="addFormRules" ref="ruleFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser">确 定</el-button>
        <el-button type="danger" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户，弹出对话框 -->
    <el-dialog title="用户编辑" :visible.sync="editDialogVisible" width="30%" @close="closeEditDialog">
      <el-form label-width="80px" :model="editForm" :rules="editFormRules" ref="editRuleFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    /* 自定义校验规则 */
    // 检验邮箱的合法性
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/ /* 邮箱的校验规则 */
      if (!regEmail.test(value)) {
        return callback(new Error('请输入合法的邮箱格式'))
      }
      return callback() /* 自定义校验 callback 必须被调用 */
    }
    // 检验手机号码的合法性
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (!regMobile.test(value)) {
        return callback(new Error('请输入合法的手机号码')) /*  */
      }
      return callback() /* 自定义校验 callback 必须被调用 */
    }
    return {
      dialogVisible: false /* 设置添加用户的对话框是否可见 */,
      editDialogVisible: false /* 设置编辑用户对话框是否可见 */,
      // 添加用户信息
      addForm: {
        username: 'zsjk',
        password: '74sfdfs',
        email: '1565554368@ds.cd',
        mobile: '13798945656',
      },
      // 编辑用户信息
      editForm: {},
      // 添加用户规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名在3~10个字符之间',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名在6~15个字符之间',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, message: '手机号码格式不正确，请重新输入', trigger: 'blur' },
        ],
      },
      // 编辑用户规则
      editFormRules: {
        email: [{ validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }],
        mobile: [{ validator: checkMobile, message: '手机号码格式不正确，请重新输入', trigger: 'blur' }],
      },
      queryInfo: {
        query: '' /* 双向绑定搜索框 */,
        pagenum: 1 /* 当前的页数 */,
        pagesize: 5 /* 每页显示的数据条数 */,
      },
      userList: [] /* 用户数据 */,
      total: 0 /* 表格数据条数 */,
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 发送请求获取用户数据,并将数据保存到data中
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败!')
      }
      this.userList = res.data.users
      this.total = res.data.total
      this.pagenum = res.data.pagenum
    },
    // 输入框中搜索用户信息
    search() {
      /* 此时当用户输入信息后，回车直接搜索 */
      this.getUserList()
    },
    // 获取当前所编辑用户的相关数据保存到editForm中(点击编辑按钮的时候触发) /* - 请求路径：users/:id 请求方法：get */
    async showEditDialog(row) {
      this.editDialogVisible = true
      console.log(`当前用户的id: ${row.id}`)
      const { data: res } = await this.$http.get('users/' + row.id)
      if (res.meta.status !== 200) {
        return this.$message.error('当前用户编辑请求失败！')
      }
      console.log(res)
      this.editForm = res.data
      // console.log("当前用户");
      // console.log(this.editForm.username);
    },
    // 修改用户数据并提交(点击修改框中的确定按钮的时候触发)
    editUserInfo() {
      // 提交之前先验证表单
      this.$refs.editRuleFormRef.validate(async (valid) => {
        if (!valid) {
          console.log('表单数据存在错误')
          return
        } else {
          console.log('表单数据无误')
          // console.log(this.editForm);
          /* - 请求路径：users/:id  请求方法：put*/
          const { data: res } = await this.$http.put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          })
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('用户数据更新失败！')
          }
          /* 关闭编辑框 */
          this.editDialogVisible = false
          /* 刷新表格数据 */
          this.getUserList()
          /* 提示信息 */
          this.$message.success('用户数据更新成功！')
          // console.log(res.meta.status)
        }
      })
    },
    // 用户删除
    /* - 请求路径：users/:id  请求方法：delete*/
    async deleteUserById(row) {
      /* 弹框询问是否删除 */
      const userSelect = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      console.log(userSelect)
      /* 如果返回结果是"confirm",则表示确定 */
      /* 如果返回结果是"cancel",则表示取消 */
      if (userSelect !== 'confirm') {
        return this.$message.error('已取消删除！')
      }
      const { data: res } = await this.$http.delete('users/' + row.id)
      // console.log(res);
      if (res.meta.status !== 200) {
        /* 状态更新失败将开关按钮还原 */
        return this.$message.error('用户删除失败！')
      }
      /* 刷新表格数据 */
      this.getUserList()
      this.$message.success('用户删除成功！')
    },
    // 表格中的状态发生改变的时候
    async changeState(row) {
      console.log(row)
      console.log(row.mg_state) /* 状态改变后的状态 */
      // 向服务器发送请求改变状态数据
      /* - 请求路径：users/:uId/state/:type   请求方法：put*/
      /*  uId 	用户 ID	  不能为空携带在url中
          type	用户状态 	不能为空携带在url中，值为 true 或者 false
      */
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        /* 状态更新失败将开关按钮还原 */
        row.mg_state = !row.mg_state
        return this.$message.error('用户状态更新失败！')
      }
      this.$message.success('用户状态更新成功！')
    },
    // 每页的条数改变时触发
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      console.log(`每页 ${val} 条`)
      //重新按照pagesize发送请求，请求最新的数据
      this.getUserList()
    },
    // 每页的页码发生改变的时候
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      console.log(`当前页: ${val}`)
      //重新按照pagenum发送请求，请求最新的数据
      this.getUserList()
    },
    // 关闭添加用户数据的对话框时触发
    closeDialog() {
      console.log('退出对话框的时候清除表单信息！')
      this.$refs.ruleFormRef.resetFields()
    },
    // 关闭添加用户数据的对话框时触发
    closeEditDialog() {
      console.log('退出对话框的时候清除表单信息！')
      this.$refs.editRuleFormRef.resetFields()
    },
    // 添加用户时校验表单中的数据
    addUser() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) {
          console.log('表单数据存在错误')
          return
        } else {
          console.log('表单数据无误')
          const { data: res } = await this.$http.post('users', this.addForm)
          console.log(res.meta.status)
          console.log(res)
          if (res.meta.status !== 201) {
            /* 201(已创建）请求成功且服务器已创建了新的资源 */
            this.$message.error('添加用户数据失败！')
          } else {
            this.$message.success('添加用户成功！')
            this.dialogVisible = false /* 关闭对话框 */
            this.getUserList() /* 刷新表格数据,请求最新的数据 */
          }
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 10px;
}
/* 搜索框和表格之间的间距 */
.el-table {
  margin-top: 10px;
}
</style>
