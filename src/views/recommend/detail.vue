<template>
  <div class="aaa">
     <music-list :title="title" :bgUrl="bgUrl" :songlist="songList"></music-list>
  </div>
</template>

<script>
  import MusicList from '@/components/musiclist'
  import {getCdInfo} from "@/api"
  export default {
    data() {
      return {
        title:"",
        bgUrl:"",
        songList:[]
      }
    },
    created() {
      this.getSlide()
    },
    methods: {
      getSlide:function(){
         getCdInfo().then((res) =>{
           this.title=res.data.cdlist[0].dissname;
           this.bgUrl=res.data.cdlist[0].logo;
           this.songList=this.editSongs(res.data.cdlist[0].songlist);
           console.log(this.songList)
         })
      },
      editSongs(list){
        let nSongList=[];
        for(var i=0;i<list.length;i++){
          let item={
            //id
            id:list[i].songid,
            //专辑id
            mid:list[i].songmid,
            //歌曲名
            name:list[i].songname,
            //专辑名
            album:list[i].albumname,
            //歌曲时长
            interval:list[i].interval,
            //专辑封面
            img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].albummid}.jpg?max_age=2592000`,
            //歌曲链接
            url:`http://dl.stream.qqmusic.qq.com/C400${list[i].songmid}/${list[i].songid}.m4a?guid=983915916&fromtag=66`,
            //歌手
            singername:list[i].singer[0].name
          }
          nSongList.push(item)
        }
        return nSongList;
      }
    },
    components:{
      MusicList
    }
  }
</script>

<style lang="less" scoped>
  .aaa{
    position: absolute;
    top:0;
    left:0;
  }
</style>
