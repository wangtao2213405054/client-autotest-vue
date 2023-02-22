// socket.js 全局方法实现
import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import store from '@/store'
import { getSocketDomain } from '@/api/conf/socketDomain'
import SocketIo from 'socket.io-client'

let socketIo, socketListener, socketEmitter
if (!getToken()) {
  const timer = setInterval(() => {
    console.count()
    if (!getToken()) return
    initSocket(getToken())
    window.clearInterval(timer)
  }, 1000)
} else {
  initSocket(getToken())
}

function getToken() { // 获取登录标识
  return store.getters.token
}

async function initSocket(token) {
  const { domain } = await getSocketDomain()
  if (!domain) return
  console.log(domain, 'socketUrl')
  const socket = new VueSocketIO({
    debug: process.env.NODE_ENV !== 'production',
    connection: SocketIo(domain, {
      extraHeaders: { token: token },
      autoConnect: true, // 已通过验证，全局使用可默认打开，组件内使用则默认关闭，使用时在打开
      // mac 下 如果为1秒时，会出现跨域问题, 重连会失败, 在 python-socket io 库中也出现了此问题, 经过调试后发现当重连过于频繁时,
      // 服务器会返回403, 但是在服务器中并没有收到任何的请求信息
      reconnectionDelay: 5000
    })
  })
  const { emitter, io, listener } = socket
  socketIo = io
  socketListener = listener
  socketEmitter = emitter
  if (process.env.NODE_ENV !== 'production') { // 与socket链接相关全局处理，与后端预定定义事件在组件内订阅使用
    io.on('connecting', () => { console.log('socketjs---正在连接') })
    io.on('connect', () => { console.log('socketjs---连接成功') })
    io.on('disconnect', () => { console.log('socketjs---断开连接') })
    io.on('connect_failed', () => { console.log('socketjs---连接失败') })
    io.on('error', () => { console.log('socketjs---错误发生，并且无法被其他事件类型所处理') })
    io.on('reconnect_attempt', () => { console.log('socketjs---触发尝试重新连接') })
    io.on('reconnecting', () => { console.log('socketjs---正在重连') })
    io.on('reconnect_failed', () => { console.log('socketjs---重连失败') })
    io.on('reconnect', () => { console.log('socketjs---重连成功') })
  }
  Vue.use(socket) // 只是挂载了io模块，存在已加载页面无法订阅问题，不如不使用，自己挂载方便
  // Object.defineProperty(Vue.prototype, '$socket', { value: socketIo })
  // Object.defineProperty(Vue.prototype, '$socketListener', { value: socketListener })
  // Object.defineProperty(Vue.prototype, '$socketEmitter', { value: socketEmitter })
}
export default { socketIo, socketListener, socketEmitter }
