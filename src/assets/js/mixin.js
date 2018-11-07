import {mapGetters} from 'vuex'
export const myMixin={
  computed:{
    ...mapGetters(['playList'])
  },
  mounted(){
     this.watchPlayList(this.playList)
  },
  activated(){
     this.watchPlayList(this.playList)
  },
  watch:{
    playList(val){
      this.watchPlayList(val)
    }
  },
  methods:{
    watchPlayList(){

    }
  }
}
