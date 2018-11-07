<template>
  <div class="aaa">
     <music-list :title="title" :bgUrl="bgUrl" :songlist="songList"></music-list>
  </div>
</template>

<script>
  import MusicList from '@/components/musiclist'
  import {getSingerInfo} from "@/api"
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
         getSingerInfo(this.$route.params.id).then((res) =>{
           // return res.data;
           this.title=res.data.singer_name;
           this.bgUrl=`https://y.gtimg.cn/music/photo_new/T001R300x300M000${res.data.singer_mid}.jpg?max_age=2592000`;
           this.songList=this.editSongs(res.data.list);
         })
      },
      editSongs(list){
        let nSongList=[];
         for(var j=0;j<list.length;j++){
            let item2={
               //id
               id:list[j].musicData.songid,
               //专辑id
               mid:list[j].musicData.songmid,
               //歌曲名
               name:list[j].musicData.songname,
               //专辑名
               album:list[j].musicData.albumname,
               //歌曲时长
               interval:list[j].musicData.interval,
               //专辑封面
               img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[j].musicData.albummid}.jpg?max_age=2592000`,
               //歌曲链接
               url:`http://dl.stream.qqmusic.qq.com/C400${list[j].musicData.songmid}/${list[j].musicData.songid}.m4a?guid=983915916&fromtag=66`,
               //歌手
               singername:list[j].musicData.singer[0].name
             }
          nSongList.push(item2);
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
