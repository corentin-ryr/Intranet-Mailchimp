import Vue from "vue"
import App from "./App.vue"
import vuetify from "./plugins/vuetify"
import "material-design-icons-iconfont/dist/material-design-icons.css"
import store from "./plugins/store"

//Firebase
import firebase from "firebase"

// Add the Firebase services that you want to use
import "firebase/auth"
import "firebase/functions"
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

Vue.config.productionTip = false

new Vue({
	vuetify,
	store,
	render: (h) => h(App),
}).$mount("#app")
