<template>
  <div class="music-header">
    <div class="logo"></div>
    <div class="txt">音乐播放器</div>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="less" scoped>
 @import url('~@/assets/less/variable.less');
 .music-header{
   height:0.44rem;
   display:flex;
   .logo{
     width:0.32rem;
     height:0.32rem;
     border-radius:50%;
     display:inline-block;
     background:url("default.png");
     background-size:100% 100%;
     position:relative;
     top:0.05rem;
     margin-left:1.1rem;
   }
   .txt{
     line-height:0.44rem;
     color:@color-theme;
     display:inline-block;
     font-size:@font-size-medium;
   }
 }
</style>
