import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
const app = createApp(App)
import router from './router'
import * as Icons from '@ant-design/icons-vue'
// 加入ant
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css'; // or 'ant-design-vue/dist/antd.less'
import './assets/main.css'
app.use(Antd)
// 全局使用图标，遍历引入
const icons: any = Icons
for (const i in icons) {
    app.component(i, icons[i])
}

app.use(createPinia())
app.use(router)

app.mount('#app')
