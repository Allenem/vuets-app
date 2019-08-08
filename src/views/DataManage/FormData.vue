<template>
  <div class="form-data">
    <el-form ref="ruleForm" :rules="rules" :model="form" label-width="100px" >
      
      <el-form-item label="课程名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入课程名称"></el-input>
      </el-form-item>

      <el-form-item label="课程等级" prop="level">
        <el-select v-model="form.level" placeholder="请选择课程等级">
          <el-option label="初级" value="初级"></el-option>
          <el-option label="中级" value="中级"></el-option>
          <el-option label="高级" value="高级"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="报名人数" prop="count">
        <el-input v-model="form.count" placeholder="请输入报名人数"></el-input>
      </el-form-item>

      <el-form-item label="上线日期" prop="date">
        <el-date-picker type="date" v-model="form.date" placeholder="选择上线日期" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>

      <el-form-item label="技术栈" prop="type">
        <el-radio-group v-model="form.type" >
          <el-radio label="Vue" name="type"></el-radio>
          <el-radio label="React" name="type"></el-radio>
          <el-radio label="Node" name="type"></el-radio>
          <el-radio label="Miniprogram" name="type"></el-radio>
          <el-radio label="Angular" name="type"></el-radio>
          <el-radio label="Python" name="type"></el-radio>
          <el-radio label="Mathematics" name="type"></el-radio>
          <el-radio label="English" name="type"></el-radio>
          <el-radio label="AI" name="type"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" @click="submitForm('ruleForm')">创建课程</el-button>
        <el-button size="small" type="warning" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script lang='ts'>
import {Component,Vue,Provide} from 'vue-property-decorator' // inport decorator
@Component({
  components:{}
})
export default class FormData extends Vue {
  @Provide() form:object = {
    title: "",
    type: "",
    level: "",
    count: "",
    data: "",
  }

  @Provide() rules:any={
    title:[{required:true,message:"请输入课程名称",trigger:"blur"}],
    level:[{required:true,message:"请输入课程等级",trigger:"blur,change"}],
    count:[{required:true,message:"请输入报名人数",trigger:"blur"}],
    date:[{type:"string",required:true,message:"请选择日期",trigger:"change"}],
    type:[{required:true,message:"请输入技术栈",trigger:"change"}],
  }

  submitForm(formName:string){
    (this.$refs[formName] as any).validate((valid:boolean) => {
      if(valid){
        (this as any).$axios.post(`/api/profiles/add`,this.form)
          .then((res:any)=>{
            // console.log(res.data);
            (this as any).$message({
              message:res.data.msg,
              type:"success"
            });
            this.resetForm(formName);
          })
      }
    })
  }

  resetForm(formName:string){
    (this as any).$refs[formName].resetFields();
  }
}
</script>

<style lang="scss" scoped>
.form-data {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  padding: 35px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);

  .el-input,
  .el-select {
    width: 200px !important;
  }
  .division {
    margin: 0 10px;
    color: #606266;
  }
}
</style>