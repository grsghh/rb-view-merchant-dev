<template>
  <div class="login-container">
    <div class="login-left">
<!--      <img src="../../assets/imgs/login-bg.jpg" alt="">-->
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
             label-position="left">

      <div class="title-container flex-login">
        <p></p>
        <h3 class="title">
          经销商管理系统
        </h3>
        <p></p>
        <!--        <lang-select class="set-language" />-->
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
      </el-tooltip>
      <div style="display:flex;justify-content:flex-end;margin-right: 40px;cursor:pointer;" @click="forget()">
        <p style="color: #13ce66;margin-top: 0;">忘记密码</p>
      </div>


      <el-button :loading="loading" type="success" style="width:200px;margin:0 50px;margin-bottom:30px;padding: 15px 0"
                 @click.native.prevent="handleLogin">
        {{ $t('login.logIn') }}
      </el-button>
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign/>
    </el-dialog>
  </div>
</template>

<script>
    import {validUsername} from '@/utils/validate'
    import SocialSign from './components/SocialSignin'

    export default {
        name: 'Login',
        components: {SocialSign},
        data() {
            const validateUsername = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入账号'))
                } else {
                    callback()
                }
            };
            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('请输入密码'))
                } else {
                    callback()
                }
            };
            return {
                loginForm: {
                    username: '',
                    password: '',
                    userType: 2
                },
                loginRules: {
                    username: [{required: true, trigger: 'blur', validator: validateUsername}],
                    password: [{required: true, trigger: 'blur', validator: validatePassword}]
                },
                passwordType: 'password',
                capsTooltip: false,
                loading: false,
                showDialog: false,
                redirect: undefined,
                otherQuery: {}
            }
        },
        watch: {
            $route: {
                handler: function (route) {
                    const query = route.query
                    if (query) {
                        this.redirect = query.redirect
                        this.otherQuery = this.getOtherQuery(query)
                    }
                },
                immediate: true
            }
        },
        created() {
            // window.addEventListener('storage', this.afterQRScan)
            this.autoLogin();
        },
        mounted() {
            if (this.loginForm.username === '') {
                this.$refs.username.focus()
            } else if (this.loginForm.password === '') {
                this.$refs.password.focus()
            }
        },
        destroyed() {
            // window.removeEventListener('storage', this.afterQRScan)
        },
        methods: {
            //忘记密码
            forget(){
              this.$router.push({path:'/ForgetPsw'})
            },
            checkCapslock({shiftKey, key} = {}) {
                if (key && key.length === 1) {
                    if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
                        this.capsTooltip = true
                    } else {
                        this.capsTooltip = false
                    }
                }
                if (key === 'CapsLock' && this.capsTooltip === true) {
                    this.capsTooltip = false
                }
            },
            showPwd() {
                if (this.passwordType === 'password') {
                    this.passwordType = ''
                } else {
                    this.passwordType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.password.focus()
                })
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        this.$store.dispatch('user/login', this.loginForm)
                            .then((res) => {
                                this.loading = false
                                if (res.status == 1) {
                                    this.$router.push({path: this.redirect || '/', query: this.otherQuery})
                                }
                            })
                            .catch(() => {
                                this.loading = false
                            })
                    } else {
                        return false
                    }
                })
            },
            getOtherQuery(query) {
                return Object.keys(query).reduce((acc, cur) => {
                    if (cur !== 'redirect') {
                        acc[cur] = query[cur]
                    }
                    return acc
                }, {})
            }
            , autoLogin() {
                //开发环境 自动填充账号密码
                if (process.env.VUE_APP_ENV === 'development') {
                    this.loginForm.username = '18538524945';
                    this.loginForm.password = '123456';
                }
            }
        }
    }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #fff;
  $light_gray: #fff;
  $cursor: #666;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-form-item--medium {
      .el-form-item__content{
        line-height: 28px;
      }
    }
    .el-input {
      display: inline-block;
      height: 30px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: #a5a6a8;
        height: 30px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid #d9dde6;
      background: #fff;
      border-radius: 5px;
      color: #a5a6a8;
      margin-bottom: 18px;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    height: 100%;
    width: 100%;
    /*margin: 0px auto;*/
    padding-top: 100px;
    padding-left: 20px;
    padding-bottom: 100px;
    background-color: #f5f5f5;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .login-left{
      width: 65%;
      height: 720px;
      background: url("../../assets/imgs/login-bg.jpg") no-repeat center center;
      background-size: cover;
    }
    .flex-login{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      p{
        width: 40px;
        height: 2px;
        background-color: #eee;
      }
    }
    .login-form {
      width: 420px;
      padding: 0 60px;
      border-radius: 30px;
      background-color: #fff;
      margin-left: -40px;
      margin-top: -100px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
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
      width: 282px;
      position: relative;
      margin: 30px auto;

      .title {
        font-size: 26px;
        color: #474948;
        text-align: center;
        font-weight: bold;
        margin:0 10px;
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: 3px;
        font-size: 18px;
        right: 0px;
        cursor: pointer;
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

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
