
import { Message, Notification } from 'element-ui'

// 全局 sockets
const sockets = {
  // 普通消息
  message(data) {
    const { message, type, duration } = data
    Message({
      message: message,
      type: type || 'info',
      duration: duration || 2 * 1000
    })
  },
  // 通知框
  notify(data) {
    const { title, message, type, duration, position, dangerouslyUseHTMLString, offset, showClose } = data
    Notification({
      message: message,
      title: title,
      type: type || null,
      duration: duration || 2 * 1000,
      position: position || 'top-right',
      dangerouslyUseHTMLString: dangerouslyUseHTMLString || false,
      offset: offset || 0,
      showClose: showClose || true
    })
  }
}
console.log('this global-socket.js')
export default sockets
