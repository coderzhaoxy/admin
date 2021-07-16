<template>
  <el-container class="home-container">
    <!--    头部区域-->
    <el-header class="home-header">
      <div>
        <img src="../../assets/img/dog.jpg" alt="">
        <span>后台管理系统</span>
      </div>
      <el-menu
        :route="true"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#373d41"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu index="2">
          <template slot="title">个人中心</template>
          <el-menu-item index="2-1">我的信息</el-menu-item>
          <el-menu-item index="2-2">消息中心</el-menu-item>
          <el-menu-item index="2-3">设置</el-menu-item>
        </el-submenu>
      </el-menu>
      <div>
        <el-button @click="logout">退出</el-button>
      </div>
    </el-header>
    <!--    主题区域-->
    <el-container>
      <!--      侧边栏区域-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="showMenu">|||</div>
        <!--        左侧菜单栏区域-->
        <el-menu
          default-active="2"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="false "
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath">
          <!--          一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menuList">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--            二级菜单-->
            <el-menu-item :index="'/'+subItem.path" :ndex="subItem.id+''" v-for="subItem in item.children"
                          @click="saveNavState('/'+subItem.path)">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--      内容区域-->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {getMenuList} from "../../network/home";

  export default {
    name: "Home",
    data() {
      return {
        //左侧菜单栏的数组
        menuList: [],
        // 当前活跃的路径
        activePath: '',
        //控制侧边栏的展开与折叠
        isCollapse: false,
        iconList: {
          '125': 'iconfont icon-yonghu',
          '103': 'iconfont icon-quanxianguanli',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-dingdan',
          '145': 'iconfont icon-shujutongji',

        }
      }
    },
    created() {
      this._getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
      //退出登录按钮
      logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      _getMenuList() {
        getMenuList().then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取菜单列表失败')
          }
          this.menuList = res.data
        })
      },
      //点击按钮切换菜单的折叠与展开
      showMenu() {
        return this.isCollapse = !this.isCollapse
      },
      //保存链接的激活状态
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      }
    }
  }
</script>

<style scoped>
  @import "../../assets/fonts/iconfont.css";

  .home-container {
    height: 100%;
  }

  .home-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }

  .home-header div {
    display: flex;
    align-items: center;
  }

  .home-header img {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    margin-right: 15px;
  }

  .el-aside {
    background-color: #333744;
  }

  .el-menu {
    border-right: none;
  }

  .main {
    background-color: #EAEDF1;
    overflow-y: scroll !important;
    height: 94vh;
    padding-bottom: 50px;
  }

  .toggle-button {
    background-color: #4A5064;
    color: #ffffff;
    text-align: center;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

  .iconfont {
    margin-right: 10px;
  }

  .el-menu-demo {
    position: absolute;
    right: 120px;
    border: none;
  }

</style>
