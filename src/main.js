import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/theme-chalk/index.css'

createApp(App).mount('#app')


// 1. 构造假数据，实现根据位置渲染
// 2. 配置组件映射关系 {preview: xx, render: xx}