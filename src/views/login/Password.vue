<template>
  <div class="password">
    <LoginHeader>
      <!-- 该处插槽的名字要和loginheader中插槽的slot名字一致，否则不能显示 -->
      <el-form 
        slot="container"
        :rules="rules"
        :model="ruleForm"
        ref="ruleForm"
        label-position="left"
        label-width="0px"
      >
        <div class="title">
          <h3>找回密码</h3>
        </div>

        <!-- username -->
        <el-form-item prop="username">
          <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="账号">
            <i slot="prefix" class="el-icon-user-solid"></i>
          </el-input>
        </el-form-item>

        <!-- email -->
        <el-form-item prop="email">
          <el-input type="text" v-model="ruleForm.email" auto-complete="off" placeholder="邮箱">
            <i slot="prefix" class="el-icon-message"></i>
          </el-input>
        </el-form-item>

        <!-- 确定 -->
        <el-form-item>
          <el-button 
            :loading="loading"
            type="primary" 
            style="width:100%"
            @click.native.prevent="handleSubmit"
          >
            确定
          </el-button>
        </el-form-item>

        <!-- 返回登录 -->
        <el-form-item>
          <el-button type="text" class="tologin" @click="$router.push('/login')">登录账号</el-button>
        </el-form-item>

      </el-form>
    </LoginHeader>
  </div>
</template>

<script lang='ts'>
import {Component,Vue,Provide} from 'vue-property-decorator'
import LoginHeader from './LoginHeader.vue'

@Component({
  components:{
    LoginHeader
  }
})

export default class Password extends Vue {
  @Provide() loading:boolean = false; // 是否发起网络请求
  @Provide() ruleForm:{username:string,email:string} = {username:'',email:''}; 
  @Provide() rules = {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    email: [
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type:"email", message: '请输入正确的邮箱地址', trigger: 'blur,change' },
    ],
  };
  handleSubmit():void{
    (this.$refs["ruleForm"] as any).validate((valid:boolean) => {
      if(valid){
        this.loading = true;
        // 网络请求
        (this as any).$axios.post("/api/users/findPwd",this.ruleForm)
          .then((res:any) => {
            this.loading = false;
            // console.log(res.data);
            (this as any).$message({
              message: res.data.msg,
              type: "success"
            });
            (this as any).$router.push("/login");
          })
          .catch((err:any) => {
            this.loading = false;
          })
      }
    })
  };
}
</script>

<style lang='scss' scoped>
.title{
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
i{
  font-size: 14px;
  margin-left: 8px;
}
.tologin{
  float: right;
}
</style>
