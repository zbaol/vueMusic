<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
        <div class="progress-btn" ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      touch:{}
    }
  },
  props:{
    percent:{
      type:Number,
      default:0
    }
  },
  created() {
  },
  methods: {
    //根据播放时长改变进度条颜色
    progressClick(e){
      let a=e.pageX-this.$refs.progressBar.offsetLeft;
      this.$refs.progressBtn.style.transform = `translate(${a}px,0)`;
      this.$refs.progress.style.width= `${a}px`;
      this.sendPercent();
    },
    //重新计算
    sendPercent(){
      let barW=this.$refs.progressBar.clientWidth-16;
      let p=this.$refs.progress.clientWidth/barW;
      this.$emit("changePercent",p);
    },
    //
    touchStart(ev){
      //获取当前点击位置
      this.touch.s=ev.touches[0].pageX
      //获取当前已播放的宽度
      this.touch.w=this.$refs.progress.clientWidth
    },
    touchMove(ev){
      //定义一个值，判断是否是拖动状态
      this.touch.m=true
      //拖动的结束的位置
      this.touch.e=ev.touches[0].pageX
      //拖动位置在进度条范围内
      if(this.touch.e>=this.$refs.progressBar.clientWidth+this.$refs.progressBar.offsetLeft-8){
        this.touch.e=this.$refs.progressBar.clientWidth+this.$refs.progressBar.offsetLeft
      }
      if(this.touch.e<=this.$refs.progressBar.offsetLeft){
        this.touch.e=this.$refs.progressBar.offsetLeft
      }
      //拖动的宽度+原本的宽度
      let b=this.touch.e-this.touch.s+this.touch.w;
      this.$refs.progressBtn.style.transform = `translate(${b}px,0)`;
      this.$refs.progress.style.width= `${b}px`;
      this.sendPercent();
    },
    touchEnd(){
      this.touch.s=false
    }
  },
  watch:{
    //监听播放时长的百分比
    percent(val){
      //判断当前状态是否为拖动,来判断是否来监听
      if(this.touch.s){
        return
      }
      let w = this.$refs.progressBar.clientWidth-16;
      let offset = val * w;
      this.$refs.progressBtn.style.transform = `translate(${offset}px,0)`;
      this.$refs.progress.style.width= `${offset}px`;
    }
  }
}
</script>
<style lang='less' scoped>
@import "~@/assets/less/variable.less";
.progress-bar{
  height: 30px;
  .bar-inner{
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress{
      position: absolute;
      height: 100%;
      background: @color-theme;
    }
    .progress-btn-wrapper{
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn{
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid @color-text;
        border-radius: 50%;
        background: @color-theme;
      }
    }
  }
}
</style>
