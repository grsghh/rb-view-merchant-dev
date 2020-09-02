<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSideBar"/>

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!--        <search id="header-search" class="right-menu-item" />-->

        <!--        <error-log class="errLog-container right-menu-item hover-effect" />-->

        <screenfull id="screenfull" class="right-menu-item hover-effect"/>

        <!--        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">-->
        <!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->

        <!--        <lang-select class="right-menu-item hover-effect" />-->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!--          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
          <span>{{userName}}</span>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span style="display:block;" @click="dialogVisible = true">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码弹框 -->
    <el-dialog :visible.sync="dialogVisible" title="修改密码" @close="dialogClose" append-to-body>
      <el-form
        v-if="dialogVisible"
        :model="userForm"
        label-width="100px"
        ref="userFormRef"
        :rules="formRule"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="userForm.oldPassword" placeholder="请输入原密码" type="password"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="userForm.newPassword" placeholder="请输入新密码" type="password"/>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input v-model="userForm.checkPass" placeholder="请再次输入新密码" type="password"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="changePassword">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Breadcrumb from '@/components/Breadcrumb'
    import Hamburger from '@/components/Hamburger'
    import ErrorLog from '@/components/ErrorLog'
    import Screenfull from '@/components/Screenfull'
    import SizeSelect from '@/components/SizeSelect'
    import LangSelect from '@/components/LangSelect'
    import Search from '@/components/HeaderSearch'
    import {editPassword} from '@/api/user'

    export default {
        components: {
            Breadcrumb,
            Hamburger,
            ErrorLog,
            Screenfull,
            SizeSelect,
            LangSelect,
            Search
        },
        data() {
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.userForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                userName: localStorage.userName
                , dialogVisible: false
                , userForm: {
                    oldPassword: ''
                    , newPassword: ''
                    , checkPass: ''
                }
                , formRule: {
                    oldPassword: [
                        {required: true, message: '请输入原密码', trigger: 'blur'}
                    ],
                    newPassword: [
                        {required: true, message: '请输入新密码', trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                }
            }
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'avatar',
                'device'
            ])
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('app/toggleSideBar')
            },
            async logout() {
                await this.$store.dispatch('user/logout')
                sessionStorage.setItem('router', '')
                this.$router.replace(`/login`)
            }
            , dialogClose() {
                this.dialogVisible = false;
                this.userForm = {
                    oldPassword: ''
                    , newPassword: ''
                    , checkPass: ''
                }
            }
            //修改密码
            , changePassword() {
                this.$refs['userFormRef'].validate((valid) => {
                    if (valid) {
                        editPassword(this.userForm).then(res => {
                            if (res.status == 1) {
                                this.$message({
                                    type: 'success',
                                    message: '修改密码成功！'
                                });
                                this.dialogClose();
                            }
                        })
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            /*background: rgba(0, 0, 0, .025)*/
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          /*margin-top: 5px;*/
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 50%;
            font-size: 12px;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
</style>
