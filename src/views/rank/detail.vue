<template>
  <div class="aaa">
     <music-list :title="title" :bgUrl="bgUrl" :songlist="songList"></music-list>
  </div>
</template>

<script>
  import MusicList from '@/components/musiclist'
  import {getRankInfo} from "@/api"
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
         getRankInfo(this.$route.params.id).then((res) =>{
           console.log(res)
           // return res.data;
           this.title=res.topinfo.ListName;
           this.bgUrl=res.topinfo.pic_album;
           this.songList=this.editSongs(res.songlist)
         })
      },
      editSongs(list){
        let nSongList=[];
        for(var k=0;k<list.length;k++){
          let item1={
            //id
            id:list[k].data.songid,
            //专辑id
            mid:list[k].data.songmid,
            //歌曲名
            name:list[k].data.songname,
            //专辑名
            album:list[k].data.albumname,
            //歌曲时长
            interval:list[k].data.interval,
            //专辑封面
            img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[k].data.albummid}.jpg?max_age=2592000`,
            //歌曲链接
            url:`http://dl.stream.qqmusic.qq.com/C400${list[k].data.songmid}/${list[k].data.songid}.m4a?guid=983915916&fromtag=66`,
            //歌手
            singername:list[k].data.singer[0].name
          }
          nSongList.push(item1)
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
