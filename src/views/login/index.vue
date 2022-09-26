<template>
  <div class="login-container">
    <el-form ref="loginForm" class="login-form" :model="loginForm" :rules="rules" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>
      <!-- 用户名框 -->
      <el-form-item prop="mobile">
        <span class="svg-container el-icon-user-solid" />
        <el-input v-model="loginForm.mobile" />
      </el-form-item>
      <!-- 密码框 -->
      <el-form-item prop="password">
        <!-- 给svg-icon标签加样式，要用一个容器(span)包裹一下，在容器上加样式 -->
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input ref="pwd" v-model="loginForm.password" :type="passwordType" />
        <!-- 密码盒子的切换 点击眼睛睁开 再点击眼睛闭上 眼睛睁开能看见文字 眼睛闭上看不见文字 -->
        <span class="svg-container" @click="showPwd">
          <svg-icon :icon-class="passwordType==='password'?'eye':'eye-open'" />
        </span>
      </el-form-item>
      <el-button class="loginBtn" :loading="loading" @click="login">登录</el-button>
      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>

    </el-form>
  </div>
  <!-- 环境变量的作用
  1. 正常公司中 有几个环境 4 开发 dev 测试 test 预发 uat 线上 pro
  2. 在项目里如何配置这几个环境  通过 .env 配置 base api
  开发环境的接口前缀 /api
  线上环境的接口前缀 /prod-api
  3.el-form-item绑定对应的模块，el-input绑定对应的值
  手机号码必填按照国家标准
  密码必填 格式6-16位
   -->
</template>
<script>
// 导入校验手机号的校验规则
import { validMobile } from '@/utils/validate'
export default {
  name: 'Login',
  data() {
    const phoneValid = (rules, value, callback) => {
      // console.log(validMobile)
      if (!validMobile(value)) {
        // 没通过
        callback(new Error('格式不正确'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      passwordType: 'password',
      // 表单验证规则
      // 表单校验规则，需和数据名称一致
      rules: {
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          // 校验正则
          // { pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/, message: '手机号码格式不对', trigger: 'blur' }
          // 自定义校验的方式实现
          { validator: phoneValid, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码必填', trigger: 'blur' },
          {	min: 6, max: 16, message: '密码格式不对', trigger: 'blur' }
        ]
      },
      // 是否加载状态
      loading: false
    }
  },
  methods: {
    showPwd() {
      // this.passwordType === 'password' ? this.passwordType = '' : this.passwordType = 'password'
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      // 点击的时候还需要让密码框聚焦因为涉及到input框的创建和销毁所以需要在元素创建之后聚焦
      this.$nextTick(() => {
        this.$refs.pwd.focus()
      })
    },
    async login() {
      try {
        // this.$refs.loginForm.validate() 是一个promise
        // 如果校验通过 返回值为true
        // 校验不通过 promise rejected 会报错 被catch捕捉到
        // 通过登录接口 把数据提供给后端
        await this.$refs.loginForm.validate()
        // loading
        this.loading = true
        // 发请求
        await this.$store.dispatch('user/loginAction', this.loginForm)
        // 实现跳转
        this.$router.push('/')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg:#283443;
$light_gray:#68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url('~@/assets/common/login.jpg'); // 设置背景图片 设置背景图片不生效加波浪线就行
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
  }
  .el-form-item__error {
    color: #fff
  }
  .loginBtn {
    background: #407ffe;
    height: 64px;
    line-height: 32px;
    font-size: 24px;
    width:100%;
    margin-bottom:30px;
    border: none;
    color:#fff;
  }

}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#68b0fe;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
