<template>
  <div class="login-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">Email</h3>
      </div>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input
          ref="email"
          v-model="registerForm.email"
          placeholder="邮箱"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="2"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="verCode">
        <span class="svg-container">
          <svg-icon icon-class="message" />
        </span>
        <el-input
          ref="verCode"
          v-model="registerForm.verCode"
          placeholder="验证码"
          name="verCode"
          type="text"
          tabindex="3"
          auto-complete="on"
          style="display: inline-block;width: 50%;"
        />
        <el-button
          ref="sendButton"
          type="primary"
          :disabled="isDisabled"
          style="display: inline-block;width: 43%;"
          @click="sendVerCode()"
        >发送验证码
        </el-button>
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="4"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="confirmPassword"
          v-model="registerForm.confirmPassword"
          :type="passwordType"
          placeholder="确认密码"
          name="confirmPassword"
          tabindex="5"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleRegister"
      >注册
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { Message } from "element-ui"
import { checkEmail, checkPassWord, checkConfirmPassword } from "@/utils/validate"

export default {
  name: "Register",
  data() {
    const chkEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入邮箱"))
      } else if (!checkEmail(value)) {
        callback(new Error("请输入正确的邮箱"))
      } else {
        callback()
      }
    }

    const chkPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"))
      } else if (!checkPassWord(value)) {
        callback(new Error("密码长度为8-32位，且包含数字、大写字母、小写字母、特殊字符任意三种"))
      } else {
        callback()
      }
    }

    const chkConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"))
      } else if (!checkConfirmPassword(value, this.registerForm.password)) {
        callback(new Error("两次输入的密码不一致"))
      } else {
        callback()
      }
    }

    return {
      registerForm: {
        email: "",
        username: "",
        verCode: "",
        password: "",
        confirmPassword: ""
      },
      registerRules: {
        email: [
          { required: true, validator: chkEmail, trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 16 个字符", trigger: "blur" }
        ],
        verCode: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ],
        password: [
          { validator: chkPassword, trigger: ["blur", "change"] },
          { required: true, min: 8, max: 32, message: "长度在 8 到 32 个字符", trigger: ["blur", "change"] }
        ],
        confirmPassword: [
          { validator: chkConfirmPassword, trigger: ["blur", "change"] },
          { required: true, min: 8, max: 32, message: "长度在 8 到 32 个字符", trigger: ["blur", "change"] }
        ]
      },
      isDisabled: false,
      loading: false,
      passwordType: "password",
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = ""
      } else {
        this.passwordType = "password"
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch("user/register", this.registerForm).then(() => {
            this.$router.push({ path: this.redirect || "/login" })
            Message.info("注册成功。")
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log("提交失败")
          return false
        }
      })
    },

    sendVerCode() {
      const email = this.registerForm.email
      if (checkEmail(email)) {
        this.$store.dispatch("user/getVerCode", email).then(() => {
          Message.info("验证码已发送。")
          this.turnOffSendButton(120)
        })
      } else {
        Message.error("邮箱格式错误！")
      }
    },

    /**
     *发送验证码后关闭按钮
     **/
    turnOffSendButton(count) {
      const sendButton = this.$refs.sendButton
      const that = this
      const countDown = setInterval(function() {
        if (count === 0) {
          that.isDisabled = false
          sendButton.$el.innerHTML = "重新发送"
          clearInterval(countDown)
        } else {
          that.isDisabled = true
          sendButton.$el.innerHTML = count + "秒后可重新获取"
        }
        count--
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {

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
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  //background-image: url("../../assets/login/bg.png");
  background-size: 100% 100%;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
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

