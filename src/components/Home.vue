<template>
  <div class="home-container">
    <el-container>
      <!-- 页面顶部 -->
      <el-header class="home-el-header">
        <el-row :gutter="20">
          <el-col :span="3">
            <div class="grid-content bg-purple">
              <div class="headPicture">
                <el-avatar icon="el-icon-user-solid"></el-avatar>
                <span>当前用户</span>
              </div>
            </div>
          </el-col>
          <el-col :span="19">
            <div class="grid-content bg-purple">后台管理系统</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="logout">退出登录</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <!-- 页面侧边栏 -->
      <el-container>
        <el-aside class="home-el-nav" width="200px">
          <el-row class="tac">
            <el-col :span="24">
              <!-- router开启路由模式 -->
              <el-menu
                :default-active="$route.path"
                background-color="#304156"
                text-color="#BFCBD9"
                active-text-color="#409EFF"
                router
              >
                <!-- 一级菜单 -->
                <!-- 注意 :index中只接受字符串 -->
                <el-submenu v-for="item in menuList" :key="item.id" :index="'/' + item.path">
                  <template slot="title">
                    <!-- 导航栏图标 -->
                    <!-- <i class="el-icon-user"></i> -->
                    <i :class="icons[item.id]"></i>
                    <!-- 导航栏文字 -->
                    <span>
                      {{ item.authName }}
                    </span>
                  </template>
                  <!-- 二级菜单 -->
                  <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/home/' + subItem.path">
                    <!-- 二级导航栏文字 -->
                    <template slot="title">
                      <!-- 导航栏文字 -->
                      <span>
                        {{ subItem.authName }}
                      </span>
                    </template>
                  </el-menu-item>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <!-- 页面主体 -->
        <el-main class="home-el-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: null,
      icons: {
        '125': 'iconfont icon-yonghuguanli',
        '103': 'iconfont icon-quanxianguanli',
        '101': 'iconfont icon-shangpinguanli',
        '102': 'iconfont icon-dingdan',
        '145': 'iconfont icon-shujutongji',
      },
    }
  },
  created() {
    // 在created阶段请求左侧菜单数据
    this.getMenuList()
  },
  methods: {
    // 当前活跃路由
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // 登出行为
    logout() {
      // 登出清除token信息
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      // 发送请求获取左侧菜单栏导航数据
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) {
        /* 获取失败 */
        return this.$message.error(res.meta.msg)
      }
      // console.log(res.data)
      this.menuList = res.data
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  background-color: aquamarine;
  .home-el-header {
    text-align: center;
    line-height: 60px;
    background-color: white;
    .headPicture {
      line-height: 0;
      padding: 10px 0;
    }
  }
  .home-el-nav {
    background-color: salmon;
  }
  .home-el-main {
    background-color: gray;
  }
}
</style>
