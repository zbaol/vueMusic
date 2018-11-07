<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="recommendContent">
      <div>
        <div class="lunbo">
          <swiper :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide v-for="(item,index) in slide" :key="index"><img :src="item.picUrl"></swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination"  slot="pagination"></div>
          </swiper>
        </div>
        <div class="form">
          <h3>热门歌单推荐</h3>
           <div class="singForm" v-for="_item in songList" @click="detail(_item.id)">
             <img :src="_item.picUrl">
             <div class="author">
              <p>{{_item.songListDesc}}</p>
              <span>{{_item.songListAuthor}}</span>
             </div>
          </div>
        </div>
      </div>
      <div class="loading-container" v-show="isLoading">
        <loading :title="loadingTitle"></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from '@/components/scroll'
import {getRecommend} from "@/api"
import Loading from '@/components/loading'
import {myMixin} from "@/assets/js/mixin"
export default {
  mixins:[myMixin],
  data:function(){
    return {
      slide:{},
      songList:{},
      isLoading:true,
      loadingTitle:"正在努力加载中",
      swiperOption:{
        autoplay: {
          stopOnLastSlide:false,
          disableOnInteraction: false,
          delay:3000,
          waitForTransition:true
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          progressbarOpposite: true, //使进度条分页器与Swiper的direction参数相反
          bulletElement : 'li', //设定分页器指示器（小点）的HTML标签。
        }
      }
    }
  },
  created(){
    this.getSlide()
  },
  updated() {
    this.isLoading=false
  },
  methods:{
    getSlide:function(){
       getRecommend().then((res) =>{
         // return res.data;
         this.slide=res.data.slider;
         this.songList=res.data.songList;
         // const _this=this;
         // setTimeout(function(){_this.isLoading=false;},1000)
         this.isLoading=false;
       })
    },
    detail(id){
      this.$router.push({path:`/recommend/${id}`})
    },
    watchPlayList(playList){
      if(playList.length > 0){
        this.$refs.recommend.style.bottom="0.6rem"
        this.$refs.recommendContent.refresh()
      }else{
        this.$refs.recommend.style.bottom=0
        this.$refs.recommendContent.refresh()
      }
    }
  },
  components:{
    Scroll,
    Loading
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
 @import url('~@/assets/less/variable.less');
  .recommend{
    width:100%;
    position:fixed;
    top:0.92rem;
    bottom:0;
    overflow:hidden;
    .recommend-content{
      height:100%;
      div{
        .lunbo{
            margin-top:0.1rem;
            div{
              div{
                div{
                  img{
                    width:3.2rem;
                    height:1.4rem;
                  }
                }
              }
            }
          }
      }
      .form{
        h3{
          color:@color-theme;
          text-align:center;
          height:0.3rem;
          margin-top:0.2rem;
          font-size:@font-size-medium;
        }
        .singForm{
          display:flex;
          margin-top:0.2rem;
            img{
              width:0.6rem;
              height:0.6rem;
              margin:0 0.2rem 0 0.2rem;
            }
          .author{
            display:flex;
            flex-direction:column;
            justify-content:space-around;
            p{
              font-size:@font-size-medium;
              color:@color-text-ll;
              width:2rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            span{
              font-size:@font-size-medium;
              color:@color-text-d;
            }
          }
        }
      }
    }
  }

</style>
