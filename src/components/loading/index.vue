<template>
  <div class="loading">
    <img src="./loading.gif" alt="">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
  export default {
    name:"loading",
    props:{
      title:{
        type:String,
        default:'loading...'
      }
    },
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
    }
  }
</script>

<style lang="less" scoped>
 @import url('~@/assets/less/variable.less');
 .loading{
   width:100%;
   text-align: center;
   margin-top: 40%;
   img{
     width:0.3rem;
     height:0.3rem;
   }
   .desc{
     line-height: 0.2rem;
     font-size: @font-size-small;
     color:@color-text-l;
   }
 }
</style>
