import Vue from 'vue'
import NProgress from 'nprogress'
import store from '../store'
import 'nprogress/nprogress.css' // progress bar style
import router from './routes'
import { USER, ROUTER, EVENSET } from '@/store/mutation-types'
import { AppLayout } from '@/components/Layout'


NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', '404'] // no redirect whitelist

const AddCom = (Obj) => {
  let T = Obj;
  T[0]['component'] = AppLayout;
  T[0].children.forEach(item => {
    if (item.path == '/home') {
      item['component'] = () => import(/* webpackChunkName: "login" */ '@/views/tk/home')
    } else {
      item['component'] = () => import(/* webpackChunkName: "login" */ '@/views' + item.path)
    }
  })
  return T;
}

router.beforeEach((to, from, next) => {

  NProgress.start()
  const token = Vue.ss.get(USER);
  console.log('token', token);
  if (token && token.username) {
    if (to.name === 'login') {
      next('/home')
    } else {
      // console.log(evenset)
      let evenset = Vue.ss.get(EVENSET)
      if (evenset == 1) {
        if (router.options.routes.length > 2) {
          console.log(router)
          next()
        } else {
          // debugger
          const newL = AddCom(Vue.ss.get(ROUTER));
          router.options.routes = [...router.options.routes, ...newL];
          router.addRoutes(newL);
          next({ ...to, replace: true })
        }

      } else {
        store.dispatch('user/GenerateRoutes').then(() => {
          // const Addrouter = Vue.ss.get(ROUTER)
          const newL = AddCom(Vue.ss.get(ROUTER));
          router.addRoutes(newL);
          // router.addRoutes(TkRoutes);
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
      }
      // next()
    }
  } else {
    if (whiteList.includes(to.name)) {
      next()
    } else {
      // next()
      next({ path: '/login' })
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

export default router
