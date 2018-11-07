<template>
  <div class="player" v-show="this.playList.length > 0">
    <!-- 播放页面全屏 -->
    <!-- {{this.playList}} -->
    <transition name='normal'>
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景模糊 -->
        <div class="background">
          <img :src="currentSong.img" alt="" width="100%" height="100%" >
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div class="back">
            <i class="icon-back" @click="toggleFullScreen"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singername}}</h2>
        </div>
        <!-- 中间cd部分 -->
        <swiper class="middle" :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide class="middle-l">
            <div class="cd-wrapper">
              <div class="cd" :class="cdState">
                <img :src="currentSong.img" alt="" class="image">
              </div>
            </div>
            <!-- 一条歌词滚动 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{currentLyric}}</div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <!-- 歌词滚动 -->
            <scroll class="middle-r" ref="lyricList">
              <div class="lyric-wrapper">
                <div v-for="(item,index) in lyric.lines" :key="item.key">
                  <p class="text" :class="{current:index==currentLine}" ref="lyricLine">{{item.txt}}</p>
                </div>
              </div>
            </scroll>
          </swiper-slide>
        </swiper>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{changetime}}</span>
            <!-- 播放进度 -->
            <div class="progress-bar-wrapper">
              <progressBar :percent="percent" @changePercent="changeProgressTime"></progressBar>
            </div>
            <span class="time time-r">{{changeType}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="getInMode" @click="changeOnMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" >
              <i :class="btnState" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i :class="like()" @click="likes"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" @click="toggleFullScreen" v-show="!fullScreen">
        <div class="icon">
          <img :src="currentSong.img" alt="" width="40" height="40" :class="cdState">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">
            <span>{{currentSong.singername}}</span>
          </p>
        </div>
        <div class="control">
          <i :class="btnStatemini" @click.stop="togglePlaying"></i>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="look"></i>
        </div>
      </div>
    </transition>
    <!-- h5播放器 -->
    <audio :src="currentSong.url" ref="audio" @canplay="changePlayState" @error="changePlayState" @timeupdate="updatetime" @ended="ended"></audio>
    <playlist v-show="islook" @isCloseChange="look" :islook="islook"></playlist>
  </div>
</template>

<script>
import Scroll from '@/components/scroll'
import progressBar from '@/components/progressbar'
import {mapGetters,mapActions,mapMutations} from 'vuex'
import {getLyric} from '@/api'
import { Base64 } from 'js-base64';
import Lyric from 'lyric-parser'
import Playlist from '@/components/playlist'
export default {
  data(){
    return{
      //播放歌曲是否加载完成
      playState:false,
      //当前播放时长
      currentTime:0,
      //获取所有歌词
      lyric:{},
      //获取当前的歌词
      currentLyric:"",
      //歌词当前显示行
      currentLine:0,
      //播放列表是否出现
      islook:false,
      //是否收藏
      iscollect:false,
      swiperOption:{
        pagination: {
          el: '.dot-wrapper',
          type: 'bullets',
          bulletClass:"dot",
          progressbarOpposite: true, //使进度条分页器与Swiper的direction参数相反
          bulletElement : 'li', //设定分页器指示器（小点）的HTML标签。
          bulletActiveClass:"active"
        }
      }
    }
  },
  components:{
    Scroll,
    progressBar,
    Playlist
  },
  computed:{
    //转换当前播放时长
    changetime(){
      let m=this.currentTime/60 |0;
      let s=this.currentTime%60 |0;
      if(s<10){
        return `${m}:0${s}`
      }else{
        return `${m}:${s}`
      }
    },
    //转换总时长
    changeType(){
      let m=this.currentSong.interval/60 |0;
      let s=this.currentSong.interval%60 |0;
      if(s<10){
        return `${m}:0${s}`
      }else{
        return `${m}:${s}`
      }
    },
    //大屏播放暂停按钮的切换
    btnState(){
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    //小屏播放暂停按钮的切换
    btnStatemini(){
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    //中间cd的旋转暂停
    cdState(){
      return this.playing ? 'play' : 'pause'
    },
    //计算当前时间占总时间的百分比
    percent(){
      return this.currentTime /this.currentSong.interval
    },
    getInMode(){
      switch(this.mode){
        case 0:
          return "icon-sequence"
          break;
        case 1:
          return "icon-random"
          break;
        case 2:
          return "icon-loop"
          break;
      }
    },
    ...mapGetters([
      'playing',
      'fullScreen',
      'playList',
      'currentSong',
      'currentIndex',
      'mode'
    ])
  },
  methods:{
    //通过ev事件获得当前播放的时长
    updatetime(ev){
      this.currentTime=ev.target.currentTime
    },
    //切换播放暂停状态
    togglePlaying(){
      this.changePlaying(!this.playing)
      //歌曲歌词暂停播放
      if(this.lyric){
        this.lyric.togglePlay()
      }
    },
    //切换进度条
    changeProgressTime(val){
      let c=this.currentSong.interval * val;
      this.$refs.audio.currentTime=c;
      //拖动完成判断是否是播放状态
      if(!this.playing){
        this.togglePlaying()
      }
      //歌词随着歌曲的进度变化
      if(this.lyric){
        this.lyric.seek(this.$refs.audio.currentTime*1000)
      }
    },
    //判断当前歌曲是否加载完成来改变播放还是暂停
    changePlayState(){
      this.playState=true
    },
    //切换大屏还是小屏
    toggleFullScreen(){
      this.changeFullScreen(!this.fullScreen)
    },
    //切换上一首
    prev(){
      if(!this.playState){
        return
      }
      let index=this.currentIndex-1;
      if(index ==-1){
        index=this.playList.length-1
      }
      //判断当前状态是否为播放状态，切换下一首改变其播放状态
      if(!this.playing){
        this.togglePlaying()
      }
      this.changeCurrentIndex(index)
      this.playState=false;
      this.$refs.audio.play()
    },
    //切换下一首
    next(){
      if(!this.playState){
        return
      }
      let index=this.currentIndex+1;
      if(index ==this.playList.length){
        index=0
      }
      //判断当前状态是否为播放状态，切换下一首改变其播放状态
      if(!this.playing){
        this.togglePlaying()
      }
      this.changeCurrentIndex(index)
      this.playState=false;
      this.$refs.audio.play()
    },
    //获取歌词
    getLy(){
      getLyric(this.currentSong.id).then((res)=>{
        //把base64转成中文
        //使用lyric-parser解析歌词字符串，使其成为能使用的数据格式
         this.lyric=new Lyric(Base64.decode(res.lyric),this.hanlder)
         if(this.playing){
           this.lyric.play()
         }
      })
    },
    //回调函数
    hanlder({lineNum,txt}){
      this.currentLine=lineNum
      this.currentLyric=txt
      if(lineNum>5){
        let el=this.$refs.lyricLine[lineNum-5]
        this.$refs.lyricList.scrollToElement(el,50)
      }else{
        this.$refs.lyricList.scrollTo(0,50)
      }
    },
    //顺序，单曲，随机模式的切换
    changeOnMode(){
      let mode=(this.mode+1)%3;
      if(mode==1){
        this.random()
      }
      this.changeMode(mode)
    },
    //歌曲播放完成后，歌曲模式的选择
    ended(){
      this.next()
    },
    //随机播放
    random(){
      function randNum(min,max){
        return parseInt(Math.random()*(max-min+1)+min);
      }
      function xipai(arr,index){
        var num1=arr[randNum(0,arr.length-1)];
        for(var i=0;i<arr.length;i++){
          var temp;
          if(num1!=i){
            if(i==index){
              return
            }
            temp=num1;
            num1=arr[i];
            arr[i]=temp;
          }
        }
        return arr;
      }
      xipai(this.playList,this.currentIndex);
    },
    loop(){
      this.$refs.audio.currentTime=0;
      this.$refs.audio.play();
      this.lyric.seek(this.$refs.audio.currentTime*1000)
    },
    //播放列表是否出现
    look(){
      this.islook=!this.islook
    },
    //是否收藏
    likes(){
      // this.iscollect=!this.iscollect
      var storage=window.localStorage;
      if(storage.getItem("iscollect")){
        storage.setItem("iscollect",false);
      }else{
        storage.setItem("iscollect",true);
      }
      this.like()
    },
    like(){
      var storage=window.localStorage;
      return storage.getItem("iscollect") ? 'icon-favorite' :'icon-not-favorite'
    },
    ...mapMutations(['changeFullScreen','changePlaying','changeCurrentIndex','changeMode'])
  },
  watch:{
    //监听播放歌曲是否改变
    currentSong(val){
      this.$nextTick(()=>{
        this.getLy()
        this.$refs.audio.play()
      })
    },
    //监听播放器是否播放
    playing(val){
      this.$nextTick(()=>{
        val ? this.$refs.audio.play() : this.$refs.audio.pause()
      })
    }
  }
}
</script>

<style lang="less">
@import "~@/assets/less/variable.less";
.player{
  .normal-player{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: @color-background;
    .background{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter:blur(0.2rem);
    }
    .top{
      position: relative;
      margin-bottom: 0.25rem;
      .back{
        position: absolute;
        top: 0;
        left:0.06rem;
        z-index: 50;
        .icon-back{
          display: block;
          padding: 0.09rem;
          font-size:@font-size-large-x;
          color: @color-text;
          transform: rotate(-90deg);
        }
      }
      .title{
        width: 70%;
        margin: 0 auto;
        line-height: 0.4rem;
        text-align: center;
        font-size: @font-size-large;
        color: @color-text;
      }
      .subtitle{
        line-height: 0.2rem;
        text-align: center;
        font-size:@font-size-medium;
        color: @color-text;
      }
    }
    .middle{
      position: fixed;
      width: 100%;
      top: 0.8rem;
      bottom: 1.7rem;
      white-space: nowrap;
      font-style: 0;
      .middle-l{
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper{
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd{
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 0.1rem solid rgba(255,255,255,0.1);
            border-radius: 50%;
            &.play{
              animation: rotate 20s linear infinite;
            }
            &.pause{
              animation-play-state:paused;
            }
            .image{
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric-wrapper{
          width: 80%;
          margin: 0.25rem auto 0.2rem auto;
          overflow: hidden;
          text-align: center;
          font-size: @font-size-medium-x;
          color: @color-text-l;
          .player-lyric{
            height: 0.3rem;
            line-height: 0.3rem;
          }
        }
      }
      .middle-r{
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper{
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text{
            margin-top:0.1rem;
            line-height: 0.32rem;
            color: @color-text-l;
            font-size: @font-size-medium;
            &.current{
              color:@color-text;
            }
          }
        }
      }
    }
    .bottom{
      position: absolute;
      bottom: 0.5rem;
      width: 100%;
      .dot-wrapper{
        text-align: center;
        font-size: 0;
        .dot{
          display: inline-block;
          vertical-align: middle;
          margin: 0 0.04rem;
          width: 0.08rem;
          height: 0.08rem;
          border-radius: 50%;
          background: @color-text-l;
          &.active{
            width: 0.2rem;
            border-radius: 5px;
            background: @color-text-ll;
          }
        }
      }
      .progress-wrapper{
        display: flex;
        align-items: center;
        width: 80%;
        margin:0 auto;
        padding: 0.1rem 0;
        .time{
          color:@color-text;
          font-style: @font-size-small;
          flex:0 0 0.3rem;
          line-height: 0.3rem;
          width: 0.3rem;
          &.time-l{
            text-align: left;
            font-size:@font-size-medium;
          }
          &.time-r{
            text-align: right;
            font-size:@font-size-medium;
          }
        }
        .progress-bar-wrapper{
          flex:1;
        }
      }
      .operators{
        display: flex;
        align-items: center;
        line-height:0.2rem;
        .icon{
          flex:1;
          color:@color-theme;
          &.disable{
            color:@color-theme-d;
          }
          i{
            font-size: 0.3rem;
          }
        }
        .i-left{
          text-align: right;
        }
        .i-center{
          padding: 0 0.2rem;
          text-align: center;
          margin-top:0.08rem;
          i{
            font-size: 0.4rem;
          }
        }
        .i-right{
          text-align: left;
        }
        .icon-favorite{
          color:@color-sub-theme;
        }
      }
    }
    &.normal-enter-active,&.normal-leave-active{
      transition: all 0.4s;
      .top,.bottom{
        transition: all 0.4s cubic-bezier(0.86,0.18,0.82,1.32);
      }
    }
    &.normal-enter,&normal-leave-to{
      opacity: 0;
      .top{
        transform: translate3d(0,-100px,0);
      }
      .bottom{
        transform: translate3d(0,100px,0);
      }
    }
  }
  .mini-player{
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 0.6rem;
    background: @color-highlight-background;
    &.mini-enter-active,&mini-leave-to-active{
      transition:all 0.4s;
    }
    &.mini-enter,&mini-leave-to{
      opacity: 0;
    }
    .icon{
      flex:0 0 0.4rem;
      width: 0.4rem;
      padding: 0 0.1rem 0 0.2rem;
      margin-top:-0.3rem;
      img{
        border-radius: 50%;
        &.play{
          animation: rotate 10s linear infinite;
        }
        &.pause{
          animation-play-state: paused;
        }
      }
    }
    .text{
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 0.2rem;
      overflow: hidden;
      .name{
        margin-bottom:0.05rem;
        font-size: @font-size-medium;
        color:@color-text;
        margin-top:0.05rem;
      }
      .desc{
        font-size: @font-size-medium;
        color:@color-text-d;

      }
    }
    .control{
      margin-top:-0.4rem;
      width: 0.3rem;
      padding: 0 0.1rem;
      .icon-play-mini,.icon-pause-mini,.icon-playlist{
        font-size: 0.3rem;
        color:@color-theme-d;
      }
      .icon-mini{
        font-size: 0.2rem;

      }
    }
  }
}
@keyframes rotate{
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
}
.normal-enter-active,&.normal-leave-active{
  transition: all 0.4s;
  .top,.bottom{
    transition: all 0.4s cubic-bezier(0.86,0.18,0.82,1.32);
  }
}
.normal-enter,&.normal-leave-to{
  opacity: 0;
  .top{
    transform: translate3d(0,-100px,0);
  }
  .bottom{
    transform: translate3d(0,100px,0);
  }
}
</style>
