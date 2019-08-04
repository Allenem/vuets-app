<template>
  <div class="account-data">
    <div class="add-box">
      <el-button type="primary" @click="addAccount">新增用户</el-button>
    </div>
    <el-table :data="tableData" border style="width:100%">
      <!-- 角色 -->
      <el-table-column label="角色" width="180">
        <template slot-scope="scope">
          <el-select 
            @change="selectChange(scope.row)" 
            v-if="scope.row.edit" 
            v-model="scope.row.role"
          >
            <el-option 
              v-for="option in options" 
              :label="option.role" 
              :value="option.role" 
              :key="option.key"
            >
            </el-option>
          </el-select>
          <span v-else>{{scope.row.role}}</span>
        </template>
      </el-table-column>
      <!-- 账号 -->
      <el-table-column label="账号" width="180">
        <template slot-scope="scope">
          <el-input v-if="scope.row.edit" v-model="scope.row.username"></el-input>
          <span v-else>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <!-- 描述 -->
      <el-table-column label="描述" prop="des">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="180">
        <template slot-scope="scope" v-if="scope.row.username!='admin'">
          <el-button 
            size="mini" 
            type="warning" 
            v-if="!scope.row.edit" 
            @click="handleEdit(scope.$index,scope.row)"
          >
            编辑
          </el-button>
          <el-button 
            size="mini" 
            type="success" 
            v-else 
            @click="handleSave(scope.$index,scope.row)"
          >
            完成
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AddAccount :dialogVisible="dialogVisible" :options="options" @closeDialog="closeDialog"></AddAccount>
  </div>
</template>

<script lang='ts'>
import {Component,Vue,Provide} from 'vue-property-decorator' // inport decorator
import AddAccount from './AddAccount.vue' // inport decorator
import { Option } from 'element-ui';
@Component({
  components:{AddAccount}
})
export default class AccountData extends Vue {

  @Provide() tableData:any = [];

  @Provide() dialogVisible:Boolean = false;

  // select数据
  @Provide() options:any = [
    {
      key:"admin",
      role:"管理员",
      des:"Super Administrator. Have access to view all pages!"
    },
    {
      key:"edit",
      role:"客服",
      des:"Normal Editor. Can see all pages except permission page!"
    },
    {
      key:"visitor",
      role:"游客",
      des:"Just a vistor. Can only see the home page & the document page!"
    },
  ];

  created(){
    this.getUserData();
  }

  getUserData(){
    (this as any).$axios("/api/users/allUsers")
    .then((res:any) => {
      //设置编辑状态
      res.data.datas.forEach((item:any) => {
        item.edit = false;
      });
      this.tableData = res.data.datas;
    })
  }

  addAccount(){
    this.dialogVisible = true;
  }

  closeDialog(){
    this.dialogVisible = false;
    this.getUserData();
  }

  handleEdit(index:number,row:any):void{
    // 编辑
    row.edit = true;
  }

  handleSave(index:number,row:any):void{
    // 完成
    row.edit = false;
    (this as any).$axios.post(`/api/users/editUser/${row._id}`,row)
    .then((res:any) => {
      // console.log(res.data)
      this.$message({
        message:res.data.msg,
        type:"success"
      })
    })
  }

  selectChange(item:any){
    this.options.map((option:any) => {
      if(option.role == item.role){
        item.key = option.key;
        item.des = option.des;
      }
    })
  }

  handleDelete(index:number,row:any):void{
    this.$confirm('此操作将永久删除该用户数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      (this as any).$axios.delete(`/api/users/deleteUser/${row._id}`)
      .then((res:any)=>{
          this.$message({
            message:res.data.msg,
            type:"success"
          });
          this.tableData.splice(index,1);
      })
      .catch((err:any)=>{
        this.$message({
          message:`"${row.username}"删除失败!`,
          type:'warning'
        });
      });
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      });          
    });
  }
}
</script>

<style lang="scss" scoped>
.account-data{
  height: 100%;
  overflow: auto;
  .add-box{
    margin-bottom: 10px;
  }
}
</style>
