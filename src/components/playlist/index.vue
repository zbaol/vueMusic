<template>
  <transition name="list-fade">
    <div class="playlist">
      <div class="list-wrapper">
        <div class="list-header">
          <h1 class="title">
            <i :class="iconm"></i>
            <span class="text">{{modetext}}</span>
            <span class="clear" @click="delAll">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" ref="listContent">
          <transition name="list">
            <ul>
              <li class="item" ref="listItem" v-for="(item,index) in playList" :key="item.key" @click="changeSong(index)">
                <i class="current" :class="iconplay(index)"></i>
                <span class="text">{{item.name}}</span>
                <span class="like">
                  <i></i>
                </span>
                <span class="delete" @click.stop="del(item)">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </ul>
          </transition>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click='isClose'>
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Scroll from '@/components/scroll'
import {mapGetters,mapMutations,mapActions} from 'vuex'
import { MessageBox } from 'mint-ui';
export default {
  props:{
    islook:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {

    }
  },
  computed:{
    iconm(){
      return this.mode==0 ? 'icon-sequence' : this.mode==1 ? 'icon-random' :'icon-loop'
    },
    modetext(){
      return this.mode==0 ? '顺序播放' : this.mode==1 ? '随机播放' :'单曲循环'
    },
    ...mapGetters(['playList','mode','currentIndex'])
  },
  components:{
    Scroll
  },
  methods:{
    isClose(){
      this.$emit('isCloseChange')
    },
    iconplay(index){
        return index==this.currentIndex ? 'icon-play' :''
    },
    changeSong(index){
      this.changeCurrentIndex(index)
    },
    del(item){
      this.delOne(item)
    },
    delAll(){
      MessageBox.confirm('是否清空播放列表').then(() => {
        this.clear()
      });
    },
    ...mapMutations(['changeCurrentIndex',]),
    ...mapActions(['delOne','clear'])
  },
  watch:{
    islook(){
      this.$nextTick(()=>{
        this.$refs.listContent.refresh()
      })
    }
  }

}
</script>
<style scoped lang='less'>
@import "~@/assets/less/variable.less";
@import url('//unpkg.com/mint-ui/lib/style.css');
.playlist{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: @color-background-d;
  &.list-fade-enter-active, &.list-fade-leave-active{
    transition: opacity 0.3s;
    .list-wrapper{
      transition: all 0.3s;
    }
  }
  &.list-fade-enter, &.list-fade-leave-to{
    opacity: 0;
    .list-wrapper{
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: @color-highlight-background;
    .list-header{
      position: relative;
      padding: 0.2rem;
      .title{
        display: flex;
        align-items: center;
        .icon-sequence{
          margin-right: 0.1rem;
          font-size: @font-size-medium;
          color: @color-theme-d;
        }
        .icon-random{
          margin-right: 0.1rem;
          font-size: @font-size-medium;
          color: @color-theme-d;
        }
        .icon-loop{
          margin-right: 0.1rem;
          font-size: @font-size-medium;
          color: @color-theme-d;
        }
        .text{
          flex: 1;
          font-size: @font-size-medium;
          color: @color-text-l;
        }
        .clear{
          display:flex;
          align-items: center;
          .icon-clear{
            font-size: @font-size-medium;
            color: @color-text-d;
          }
        }
      }
    }
    .list-content{
      max-height: 240px;
      overflow: hidden;
      .item{
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        &.list-enter-active, &.list-leave-active{
          transition: all 0.1s;
        }
        &.list-enter, &.list-leave-to{
          height: 0;
        }
        .current{
          flex: 0 0 20px;
          width: 0.2rem;
          display:block;
          font-size: @font-size-small;
          color: @color-theme-d;
        }
        .text{
          flex: 1;
          font-size: @font-size-medium;
          color: @color-text-d
        }
        .like{
          margin-right: 15px;
          font-size: @font-size-small;
          color: @color-theme;
          .icon-favorite{
            color: @color-sub-theme;
          }
        }
        .delete{
          font-size: @font-size-small;
          color: @color-theme;
        }
      }
    }
    .list-operate{
      width: 1.6rem;
      margin: 0.2rem auto 0.2rem auto;
      .add{
        display: flex;
        align-items: center;
        padding: 0.08rem 0.16rem;
        border: 1px solid @color-text-l;
        border-radius: 100px;
        color: @color-text-l;
        .icon-add{
          margin-right: 0.1rem;
          font-size: @font-size-small-s;
        }
        .text{
          font-size: @font-size-medium;
        }
      }
    }
    .list-close{
      text-align: center;
      line-height: 50px;
      background: @color-background;
      font-size: @font-size-medium-x;
      color: @color-text-l;
    }
  }
}
</style>
