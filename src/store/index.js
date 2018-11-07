import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  //存储状态
  state:{
    //记录播放列表
    playList:[],
    //记录播放器是否全屏
    fullScreen:false,
    //播放状态
    playing:false,
    //当前播放的列表索引
    currentIndex:-1,
    //播放模式 0顺序 1随机 2单曲
    mode:0,
  },
  //计算属性
  getters:{
    playList:state => state.playList,
    fullScreen:state => state.fullScreen,
    playing:state => state.playing,
    currentIndex:state => state.currentIndex,
    //当前播放歌曲的信息
    currentSong:state => state.playList[state.currentIndex] ||{},
    mode:state =>state.mode
  },
  //注册
  mutations:{
    changePlayList(state,playList){
      state.playList=playList
    },
    changeFullScreen(state,fullScreen){
      state.fullScreen=fullScreen
    },
    changePlaying(state,playing){
      state.playing=playing
    },
    changeCurrentIndex(state,currentIndex){
      state.currentIndex=currentIndex
    },
    changeMode(state,mode){
      state.mode=mode
    }
  },
  actions:{
    addPlayer({commit},{list,index}){
      commit('changePlayList',list)
      commit('changeFullScreen',true)
      commit('changePlaying',true)
      commit('changeCurrentIndex',index)
    },
    //删除当前的歌曲
    delOne({commit,state},list){
      let index=0;
      let playlist=state.playList;
      let currentIndex=state.currentIndex;
      for(let i=0;i<playlist.length;i++){
        if(list.id==playlist[i].id){
          index=i
        }
      }
      //当前播放索引等于数组长度或者当前下标大于等于要删除的下标
      if(currentIndex==playlist.length ||currentIndex>=index){
        currentIndex--
      }
      playlist.splice(index,1)
      commit('changePlayList',playlist)
      commit('changePlaying',true)
      commit('changeCurrentIndex',currentIndex)
    },
    clear({commit}){
      commit('changePlayList',0)
      commit('changePlaying',false)
      commit('changeCurrentIndex',0)
    }
  }
})
