  <template>
    <div class="search">
      <input type="text" placeholder="搜索歌曲、歌手" @focus="show" @blur="hide" v-model="addInp">
      <span class="iconfont icon-search sear-icon"></span>
      <scroll class="search-content" ref="bscroll">
        <div>
          <div class="hot" ref="hot">
            <h3>热门搜索</h3>
            <span v-for="item in hotlist" @click="get(item)">{{item}}</span>
          </div>
            <div class="search-song" ref="searchsong">
              <ul>
                <li v-for="(a,index) in songlist" @click="addplayer(a,index)"><span class="iconfont icon-music music-icon"></span>{{a.name}}</li>
              </ul>
            </div>
            <div class="loading-container" v-show="isLoading">
                <loading></loading>
            </div>
        </div>
      </scroll>
    </div>
  </template>

  <script>
  import BScroll from 'better-scroll'
  import Scroll from '@/components/scroll'
  import Loading from '@/components/loading'
  import {getHotKey} from '@/api'
  import {search} from '@/api'
  import {mapActions} from 'vuex'
    export default {
      data() {
        return {
          //热门搜索
          hotlist:[],
          //存储输入框的值
          addInp:"",
          //通过搜索获得的值
          songlist:[],
          isLoading:true,
        }
      },
      created() {
        this.getSlide()
      },
      updated(){
        this.show(),
        this.isLoading=false;
      },
      methods: {
        getSlide:function(){
           getHotKey().then((res) =>{
             res.data.hotkey.forEach((item,index)=>{
                if(index<10){
                  this.hotlist.push(item.k)
                }
             })
           })
        },
        show(){
          if(this.addInp!=""){
            this.$refs.searchsong.style.display="block";
            this.$refs.hot.style.display="none"
          }
        },
        hide(){
          if(this.addInp==""){
            this.$refs.searchsong.style.display="none";
            this.$refs.hot.style.display="block"
          }
        },
        get(a){
          this.addInp=a;
        },
        addplayer(a,index){
          let songs=[]
              var item={
                //id
                id:a.id,
                //专辑id
                mid:a.mid,
                //歌曲名
                name:a.name,
                //专辑名
                album:a.album.name,
                //歌曲时长
                interval:a.interval,
                //专辑封面
                img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${a.album.mid}.jpg?max_age=2592000`,
                //歌曲链接
                url:`http://dl.stream.qqmusic.qq.com/C400${a.mid}/${a.id}.m4a?guid=983915916&fromtag=66`,
                //歌手
                singername:a.singer[0].name
              }
            songs.push(item)
            this.addPlayer({
              list:songs,
              index:index
            })
        },
        ...mapActions([
          'addPlayer'
        ])
      },
      components:{
        Scroll,
        Loading
      },
      watch:{
        addInp(addInp){
          this.addInp=addInp;
          this.n=20;
          this.p=1;
          console.log(this.addInp);
            search(this.addInp,this.p,this.n).then((res) =>{
              console.log(res.data);
              this.songlist=res.data.song.list;
            })
        }
      }
    }
  </script>

<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .search{
    input{
      display:block;
      border:0;
      outline:0;
      background:@color-highlight-background;
      margin:0.2rem 0.1rem 0;
      width:2.7rem;
      height:0.4rem;
      border-radius:0.05rem;
      font-size:@font-size-medium-x;
      padding-left:0.3rem;
      color:@color-text-d;
    }
    .sear-icon{
      position:absolute;
      top:1.12rem;
      left:0.15rem;
      font-size:0.22rem;
      color:black;
    }

    .search-content{
      position:fixed;
      top:1.4rem;
      bottom:0;
      overflow:hidden;
      width:3.19rem;
      .hot{
        margin:0.1rem 0 0 0.1rem;
        display:inline-block;
        font-size:@font-size-medium-x;
        h3{
          margin-top:0.05rem;
          color:@color-text-d;
          margin-left:0.1rem;
        }
        span{
          display:inline-block;
          background:@color-highlight-background;
          color:@color-text-d;
          margin:0.1rem 0.1rem 0.05rem 0.1rem;
          padding:0.08rem 0.1rem;
          border-radius:0.05rem;
        }
      }
      .search-song{
        background:@color-highlight-background;
        margin:0 0.1rem;
        overflow:hidden;
        display:none;
        ul{
          list-style:none;
          li{
            font-size:@font-size-medium-x;
            color:@color-text-d;
            line-height:0.5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .music-icon{
              font-size:0.22rem;
              color:@color-text-d;
              margin:0.15rem 0.2rem 0.2rem 0.05rem;
            }
          }
        }
      }
    }

  }

  </style>
