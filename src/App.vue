<template>
  <div id="app">
    <music-header></music-header>
    <tabs></tabs>
    <player></player>
   <router-view></router-view>
  </div>
</template>
<script>
import MusicHeader from "@/components/musicheader"
import tabs from "@/components/tabs"
import Player from '@/components/player'
export default {
  components:{
    MusicHeader,
    tabs,
    Player
  }
  // name: 'App',
  // data(){
  //   return{
  //     appTitle:"Water Music",
  //     isClick:1
  //   }
  // },
  // methods:{
  //   choose:function(index){
  //     this.isClick = index
  //   }
  // }
}
</script>

<style lang="less">
  @import '~@/assets/less/index.less';

</style>
