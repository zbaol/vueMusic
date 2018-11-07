import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/views/recommend/index.vue'
import Singer from '@/views/singer/index.vue'
import Rank from '@/views/rank/index.vue'
import Search from '@/views/search.vue'
import RecommendDetail from '@/views/recommend/detail.vue'
import SingerDetail from '@/views/singer/detail.vue'
import RankDetail from '@/views/rank/detail.vue'

Vue.use(Router)


export default new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      redirect:'/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children:[
        {
          path:'/recommend/:id',
          component:RecommendDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children:[
        {
          path:'/singer/:id',
          component:SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children:[
        {
          path:'/rank/:id',
          component:RankDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search
    },
  ]
})
