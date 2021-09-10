<template>
  <div class="login_container">
    <!-- 登录盒子 -->
    <div class="login_box">
      <!-- 登录头像 -->
      <div class="avatar_box">
        <img src="../assets/img/登录头像.png" alt="登录头像" />
      </div>
      <!-- 登录表单 -->
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-width="auto"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            show-password
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="into" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* 数据绑定 */
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      /* 表单验证规则 */
      rules: {
        username: [
          { required: true, message: '请输入用户名名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '长度在 6 到 18 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  /* 添加行为 */
  methods: {
    /* 登录行为 */
    login() {
      //点击登录的时候先调用validate方法验证表单内容是否有误
      this.$refs.loginForm.validate(async (valid) => {
        console.log(this.loginForm)
        console.log(valid) /* false */
        //如果valid参数为true则验证通过
        if (!valid) {
          return
        }
        //发送请求进行登录
        const { data: res } = await this.$http.post(
          'login',
          this.loginForm /* this.loginForm为请求头信息 */
        )
        console.log(res) /* 请求数据 */
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败，请重新登录！' + res.meta.msg)
        }
        this.$message.success('登录成功！')
        // 保存token信息
        window.sessionStorage.setItem(
          'token',
          res.data.token
        ) /* 从接口中拿到token信息，并保存到本地storage中 */
        /* 跳转到home界面 */
        this.$router.push('/home')
      })
    },
    // 重置数据
    resetLoginForm() {
      this.$refs.loginForm.resetFields()
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="less" scoped>
// 下面需要安装less-loader插件
/* npm install less-loader@7.3.0 --save-dev */
.login_container {
  height: 100%;
  background-color: skyblue;
  //表单设置
  .login_box {
    width: 450px;
    height: 280px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: skyblue;
    /* 表单头像设置 */
    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee; /* 头像边框 */
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd; /* 头像外面的圆环边框 */
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    /* 登录框和密码框 */
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
    /* 登录和重置按钮 */
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
