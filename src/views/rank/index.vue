<template>
  <div class="rank" ref="rank">
    <scroll class="rank-content" ref="content">
        <div>
          <div class="rankForm" v-for="item in topList" @click="detail(item.id)">
            <img :src="item.picUrl">
            <div class="name">
              <ol>
                <li v-for="_item in item.songList">{{_item.songname}}-{{_item.singername}}</li>
              </ol>
            </div>
          </div>
          <div class="loading-container" v-show="isLoading">
            <loading></loading>
          </div>
        </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import Scroll from '@/components/scroll'
  import {getRankList} from "@/api"
  import Loading from '@/components/loading'
  import {myMixin} from "@/assets/js/mixin"
  export default {
    mixins:[myMixin],
    data() {
      return {
        topList:{},
        isLoading:true
      }
    },
    created() {
      this.getSlide()
    },
    updated(){
      this.isLoading=false
    },
    methods: {
      getSlide:function(){
         getRankList().then((res) =>{
           console.log(res.data);
           this.topList=res.data.topList;
         })
      },
      detail(id){
        this.$router.push({path:`/rank/${id}`})
      },
      watchPlayList(playList){
        if(playList.length > 0){
          this.$refs.rank.style.bottom="0.6rem"
          this.$refs.content.refresh()
        }else{
          this.$refs.rank.style.bottom=0
          this.$refs.content.refresh()
        }
      }
    },
    components:{
        Scroll,
        Loading
    }
  }
</script>

<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
   .rank{
     position:fixed;
     top:0.82rem;
     bottom:0;
     width:100%;
     overflow:hidden;
     .rank-content{
       height:100%;
       .rankForm{
         margin-top:0.2rem;
         display:flex;
         margin-left:0.1rem;
         img{
           width:1rem;
           height:1rem;
         }
         .name{
           margin-right:0.2rem;
           display:flex;
           flex-direction:column;
           justify-content:space-around;
           padding-left:0.2rem;
           background:@color-highlight-background;
           ol{
             line-height:0.25rem;
             counter-reset:sectioncounter;
             font-size:@font-size-small;
             color:@color-text-d;
             li{
               width:1.8rem;
               overflow: hidden;
               text-overflow: ellipsis;
               white-space: nowrap;
             }
             li:before{
               content:counter(sectioncounter) " ";
               counter-increment:sectioncounter;
             }
           }
         }
       }
     }
  }

</style>
