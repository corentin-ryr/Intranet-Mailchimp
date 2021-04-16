import Vue from "vue"
import App from "./App.vue"
import vuetify from "./plugins/vuetify"
import "material-design-icons-iconfont/dist/material-design-icons.css"
import store from "./plugins/store"


// Add the Firebase services that you want to use
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/functions"
import router from './router'
const firebaseCredentials = require("./firebaseCredentials.json")
const firebaseConfig = {
	apiKey: firebaseCredentials.apiKey,
	authDomain: firebaseCredentials.authDomain,
	projectId: firebaseCredentials.projectId,
	storageBucket: firebaseCredentials.storageBucket,
	messagingSenderId: firebaseCredentials.messagingSenderId,
	appId: firebaseCredentials.appId,
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)


firebase.auth().onAuthStateChanged((user) => {
	store.dispatch("fetchUser", user)
})
Vue.prototype.$firebase = firebase
Vue.config.productionTip = false


new Vue({
    vuetify,
    store,
    router,
    render: (h) => h(App)
}).$mount("#app")
