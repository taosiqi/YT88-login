import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 第三方库
import element from './plugin/element'
import mitt from 'mitt' //组件通信

// 创建App实例
const app = createApp(App)

// 调用
element(app)

// 挂载全局
app.config.globalProperties.$emitter = mitt() //挂载到全局

app
  .use(store)
  .use(router)
  .mount('#app')
