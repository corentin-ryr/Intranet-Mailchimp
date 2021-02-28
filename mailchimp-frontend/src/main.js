import Vue from "vue"
import './plugins/axios'
import App from "./App.vue"
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import router from './router'

Vue.config.productionTip = false

new Vue({
    vuetify,
    router,
    render: (h) => h(App)
}).$mount("#app")
