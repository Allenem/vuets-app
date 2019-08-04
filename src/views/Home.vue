<template>
  <div class="home">
    <div class="home-body">
      <h4 class="title">欢迎来到 Allenem 后台管理系统</h4>
      <p class="des">Allenem，热爱编程，推荐如下学习资源</p>
      <el-button @click="learn">进入学习</el-button>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component,Vue} from 'vue-property-decorator' // inport decorator
@Component({
  components:{}
})
export default class Home extends Vue {
  learn():void{
    // 新窗口打开
    window.open("https://ke.qq.com/course/list/%E7%B1%B3%E6%96%AF%E7%89%B9%E5%90%B4","_blank");
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat;
  background-size: 100% 100%;
  .home-body {
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    text-align: center;
    padding: 100px;
    box-sizing: border-box;
    .title {
      font-size: 32px;
      font-weight: bold;
      line-height: 60px;
    }
    .des {
      font-size: 18px;
      margin: 40px 0;
    }
  }
}
</style>
