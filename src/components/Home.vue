<template>
  <div>
    <el-container>
      <el-header>
        <el-button type="info" @click="logout">登出</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    // 登出行为
    logout() {
      // 登出清除token信息
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>

<style></style>
