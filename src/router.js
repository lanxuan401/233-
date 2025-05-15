import Vue from 'vue'
import Router from 'vue-router'
import ContentAreaA from './components/ContentAreaA.vue'
import ContentAreaB from './components/ContentAreaB.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/a', component: ContentAreaA },
    { path: '/b', component: ContentAreaB },
    { path: '*', redirect: '/a' }
  ]
})
