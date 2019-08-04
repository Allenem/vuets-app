<template>
  <div class="table-data">
    <!-- search-box -->
    <div class="search-box">
      <el-input size="small" v-model="searchVal" placeholder="请输入课程名称"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <!-- <el-button size="mini" type="primary" @click="handleAdd" class="btnRight">添加</el-button> -->
    </div>
    <!-- tabledata -->
    <el-table :data="tableData" border style="width:100%" :height="tHeight" class="table-box">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column label="课程名称" prop="title"></el-table-column>
      <el-table-column label="课程等级" prop="level" width="120"></el-table-column>
      <el-table-column label="技术栈" prop="type"  width="120"></el-table-column>
      <el-table-column label="报名人数" prop="count"  width="120"></el-table-column>
      <el-table-column label="上线日期" prop="date"  width="120"></el-table-column>
      <el-table-column v-if="getUser.key != 'visitor'" label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleEdit(scope.$index,scope.row)" >编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <div class="pages" ref="page-box">
      <el-pagination 
        :page-sizes="[2,5,10,20]" 
        :page-size="size" 
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!-- dialog -->
    <EditDialog :dialogVisible="dialogVisible" :editOrAdd="editOrAdd" :form="formData" @closeDialog="closeDialog"></EditDialog>
  </div>
</template>

<script lang='ts'>
import {Component,Vue,Provide} from 'vue-property-decorator' // inport decorator
import EditDialog from './EditDialog.vue'
import {State,Getter,Mutation,Action} from 'vuex-class'
@Component({
  components:{EditDialog}
})
export default class TableData extends Vue {

  @Getter("user") getUser:any;

  @Provide() searchVal: string = ""; // 搜索框
  @Provide() tHeight: number = document.body.offsetHeight - 200 - 70; // table高
  @Provide() tableData: any = []; // 表格数据
  @Provide() page: number = 1; // 当前页
  @Provide() size: number = 5; // 请求数据数 默认5
  @Provide() total: number = 0; // 总数据数

  @Provide() dialogVisible: boolean = false; // 是否展示编辑页面
  @Provide() editOrAdd: boolean = true; // 编辑(true)还是添加(false)
  @Provide() formData: object = {
    title: "",
    type: "",
    level: "",
    count: "",
    data: "",
  }; // 表单数据

  created(){
    this.loadData();
  }

  loadData(){
    (this as any).$axios(`/api/profiles/loadMore/${this.page}/${this.size}`)
      .then((res:any)=>{
        // console.log(res.data);
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
      })
  }

  handleSizeChange(val:number):void{
    this.size = val;
    // console.log(this.size);
    this.page = 1;
    this.searchVal ? this.loadSearchData() : this.loadData();
  }

  handleCurrentChange(val:number):void{
    this.page = val;
    // console.log(this.page);
    this.searchVal ? this.loadSearchData() : this.loadData();
  }

  handleSearch():void{
    // 点击搜索
    this.page = 1;
    this.searchVal ? this.loadSearchData() : this.loadData();
  }

  loadSearchData(){
    // 加载搜索数据
    (this as any).$axios(`/api/profiles/search/${this.searchVal}/${this.page}/${this.size}`)
      .then((res:any)=>{
        // console.log(res.data);
        this.tableData = res.data.datas.list;
        this.total = res.data.datas.total;
      })
  }

  handleEdit(index:number,row:any){
    // console.log(index,row);
    this.editOrAdd = true;
    this.formData = row;
    this.dialogVisible = true;
  }


  closeDialog(){
    this.dialogVisible = false;
  }

  handleDelete(index:number,row:any){
    // console.log(row._id);
    this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      (this as any).$axios.delete(`/api/profiles/delete/${row._id}`)
      .then((res:any)=>{
          this.$message({
            message:res.data.msg,
            type:"success"
          });
          this.tableData.splice(index,1);
      })
      .catch((err:any)=>{
        this.$message({
          message:`"${row.describe}"删除失败!`,
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

/*
  handleAdd(){
    this.editOrAdd = false;
    this.formData = {
      title: "",
      type: "",
      level: "",
      count: "",
      data: "",
    };
    this.dialogVisible = true;
  }
*/
}
</script>

<style lang="scss" scoped>
.table-data {
  height: 100%;
  .table-box {
    font-size: 14px;
  }
  .pages {
    background: #fff;
    margin-top: 10px;
    padding: 10px 10px;
    text-align: right;
    height: 55px;
    box-sizing: border-box;
  }
  .search-box {
    background: #fff;
    margin-bottom: 10px;
    padding: 10px 10px;
    border-radius: 4px;
    height: 55px;
    box-sizing: border-box;
    .el-input {
      width: 200px;
      margin-right: 10px;
    }
    .btnRight{
      float: right;
    }
  }
}
</style>