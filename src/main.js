import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import CodeEditor from 'bin-code-editor'
import '@/utils/socket'
import sockets from '@/utils/global-socket'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock case
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Element.Dialog.props.lockScroll.default = false // 修复 dialog 打开时右侧出现抖动的问题
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // 设置 element 组件全局大小
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// 修改 loading 动画
import './styles/loading.scss'

// json 插件
Vue.use(CodeEditor)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  sockets,
  render: h => h(App)
})
