<template>
  <div class="singer">
    <singer-list :list="list"></singer-list>
  </div>
</template>

<script>
  import {getSingerList} from "@/api"
  import SingerList from '@/components/singerList'
  export default {
    data() {
      return {
        list:[]
      }
    },
    created(){
      this.getSlide()
    },
    methods: {
      getSlide:function(){
        getSingerList().then((res) =>{
          console.log(this.newSinger(res.data.list));
          this.list=this.newSinger(res.data.list);
        })
      },
      newSinger(list){
        let nList={
          hot:{
            title:"热门",
            item:[]
          }
        }
        list.forEach((item,index)=>{
          //取前十条数据作为热门数据
          if(index<10){
            nList.hot.item.push({
              id:item.Fsinger_mid,
              name:item.Fsinger_name,
              img:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
            })
          }
          //通过姓名首字母定义数据x
          if(!nList[item.Findex]){
            nList[item.Findex]={
              title:item.Findex,
              item:[]
            }
          }
          nList[item.Findex].item.push({
            id:item.Fsinger_mid,
            name:item.Fsinger_name,
            img:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        });
        //把对象转成有序数组
        let hot =[];
        let other=[];
        for(var k in nList){
          if(nList[k].title =="热门"){
            hot.push(nList[k])
          }else if(nList[k].title.match(/[a-zA-Z]/)){
            other.push(nList[k])
          }
        }
        other.sort((a,b)=>{
          return a.title.charCodeAt(0)-b.title.charCodeAt(0);
        })
        return hot.concat(other);
      }
    },
    components:{
      SingerList
    }
  }
</script>

<style lang="less" scoped>
.singer{
  position:fixed;
  bottom:0;
  top:0.82rem;
  width:100%;
}
</style>
