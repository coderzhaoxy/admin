<template>
  <div class="login">
    <div class="login-box">
      <div class="login-title">
        <h2>
          后台管理系统
        </h2>
      </div>
      <!--登录表单区域-->
      <el-form
        ref="loginFormRef"
        class="login-form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!--用户名-->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
            placeholder="账号"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            placeholder="密码"
            type="password"
          ></el-input>
        </el-form-item>
        <!--        按钮-->
        <el-form-item class="buttons">
          <div class="loginbtn">
            <el-button
              type="primary"
              :disabled="!checked ? true : false"
              @click="formLogin"
            >登录
            </el-button
            >
            <el-button type="info" @click="formClick">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class="bottom">
        <el-checkbox v-model="checked"
        >登录即代表您同意用户服务协议
        </el-checkbox>
        <span @click="passClick">忘记密码？</span>
      </div>

    </div>

  </div>
</template>

<script>

  import {login} from "../network/login";

  export default {
    name: "Login",

    data() {
      return {
        loginForm: {
          username: "",
          password: "",
          email: "",
        },
        //表单验证对象
        loginFormRules: {
          //验证用户名是否合法
          username: [
            {required: true, message: "请输入您的账号", trigger: "blur"},
            {
              min: 3,
              max: 10,
              message: "长度在 3 到 10 个字符",
              trigger: "blur",
            },
          ],
          //验证密码是否合法
          password: [
            {required: true, message: "请输入您的密码", trigger: "blur"},
            {
              min: 6,
              max: 15,
              message: "长度在 6 到 15 个字符",
              trigger: "blur",
            },
          ],
        },
        checked: false,
      };
    },
    created() {

    },
    methods: {
      //点击重置按钮重置表单
      formClick() {
        this.$refs.loginFormRef.resetFields();
      },
      //点击按钮登录页面
      formLogin() {
        this.$refs.loginFormRef.validate((valid) => {
          if (!valid) return;
          login(this.loginForm.username, this.loginForm.password).then((res) => {
            if (res.meta.status !== 200) {
              this.$message.error("登录失败！");
            }
            this.$message.success("登录成功！");
            //登录成功后将token值保存到window.sessionStorage中
            window.sessionStorage.setItem("token", res.data.token);
            this.$router.push("/home");
          });
        });
      },
      passClick(){
        alert('请联系管理员修改密码！')
      }
    },

  };
</script>

<style scoped>
  .login {
    /* background-color: #2b4b6b; */
    height: 100%;
    background-image: url(../assets/img/img.png);
    background-position: center;
  }

  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 500px;
    height: 350px;
    background-color: #fff;
    border-radius: 3px;
    transform: translate(-50%, -50%);
  }

  .login-title {
    text-align: center;
    margin: 30px 0;
  }

  .login-form {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .buttons {
    display: flex;
    justify-content: center;
  }

  .bottom {
    text-align: center;
  }

  .bottom span {
    margin-left: 30px;
    font-size: 14px;
    color: #9a6e3a;
  }

  .bottom span:hover {
    color: #0086b3;
  }

</style>
