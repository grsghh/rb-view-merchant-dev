<template>
  <div class="forget">
    <template v-if="show">
      <h3>忘记密码</h3>
      <div class="register-input">
        <span class="register-item">手机号</span>
        <input type="text" class="input-main" v-model="mobile" placeholder="手机号">
      </div>
      <div class="register-input">
        <span class="register-item">验证码</span>
        <div class="flex">
          <input type="text" class="input-main" v-model="verificationCode" placeholder="验证码">
          <button v-if="codeTime === 60" @click="code">获取验证码</button>
          <button v-else>{{codeTime}}s</button>
        </div>
        <div class="btn">
          <button @click="SureCode">确定</button>
        </div>
      </div>
    </template>

    <template v-if="!show">
      <h3>设置密码</h3>
      <div class="register-input">
        <span class="register-item">请输入密码</span>
        <input type="password" class="input-main" v-model="newPassword" placeholder="请输入密码">
      </div>
      <div class="register-input">
        <span class="register-item">请再次输入密码</span>
        <input type="password" class="input-main" v-model="isnewPassword" placeholder="请再次输入密码">
      </div>
      <div class="btn">
        <button @click="comfirmPsw">确定</button>
      </div>
    </template>

  </div>
</template>

<script>
  import { getCode, checkCode, resetPsw } from '@/api/forget'
  let timer = '';
  export default {
    nam: 'ForgetPsw',
    data() {
      return {
        newPassword: '',
        isnewPassword: '',
        mobile: '',
        verificationCode: '',
        show: true,
        codeTime:60
      }
    },
    destroyed(){
      if(timer) clearTimeout(timer);
    },
    methods: {
      //获取验证码
      code(){
        if(this.mobile == ''){
          this.$message({
            type:'warning',
            message:'请输入手机号'
          })
          return
        }
        let data = {
          mobile:this.mobile,
          userType:2
        }
        getCode(data).then(res=>{
          if(res.status === 1 ){
            this.countTime()
          }
        })
      }
      //倒计时
      ,countTime(){
        this.codeTime --;
        if(this.codeTime < 0){
          this.codeTime = 60;
          clearTimeout(timer);
        }else{
          timer = setTimeout(()=>{
            this.countTime();
          },1000)
        }
      },
      //校验验证码
      SureCode(){
        if(this.mobile == ''){
          this.$message({
            type:'warning',
            message:'请输入手机号'
          })
          return
        }
        if(this.verificationCode == ""){
          this.$message({
            type:'warning',
            message:'请输入验证码'
          })
          return
        }
        let data = {
          mobile:this.mobile,
          userType: 2,
          verificationCode: this.verificationCode
        }
        checkCode(data).then(res=>{
          if(res.status === 1){
            this.show = false
          }
        })
      },
      //确定修改密码
      comfirmPsw(){
        if(this.newPassword == ''){
          this.$message({
            type:'warning',
            message:'请输入密码'
          })
          return
        }
        if(this.isnewPassword !== this.newPassword){
          this.$message({
            type:'warning',
            message:'两次密码不一致'
          })
          return
        }
        let data = {
          mobile:this.mobile,
          userType:2,
          newPassword: this.newPassword
        }
        resetPsw(data).then(res=>{
          if(res.status === 1){
            this.$message({
              type:'success',
              message:'修改成功！'
            })
            this.$router.push({path:'/login'})
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .forget {
    width: 1200px;
    margin: 100px auto;

    h3 {
      font-size: 30px;
      color: #666;
    }

    .register-input {
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;

      span {
        color: #333;
        margin-bottom: 10px;
      }

      input {
        height: 36px;
        width: 500px;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px 15px;
        outline: none;
        font-size: 14px;
      }

      .flex {
        width: 500px;
        display: flex;
        justify-content: flex-start;
        position: relative;

        button {
          border: none;
          outline: none;
          border-radius: 0 5px 5px 0;
          height: 36px;
          width: 100px;
          border-left: 1px solid #ccc;
          background-color: transparent;
          position: absolute;
          right: 0;
          top: 0;
          color: #13ce66;
          cursor: pointer;
        }
      }
    }

    .btn {
      margin-top: 20px;

      button {
        border: none;
        outline: none;
        width: 120px;
        height: 40px;
        border-radius: 6px;
        background-color: #13ce66;
        color: #fff;
        cursor: pointer;
      }
    }
  }

</style>
