import Vue from "vue"
import App from "./App.vue"
import vuetify from "./plugins/vuetify"
import "material-design-icons-iconfont/dist/material-design-icons.css"
import Vuex from "vuex"

// Add the Firebase services that you want to use =======================
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/functions"
import router from "./router"
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

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		moderator: false,
		admin: false,
		user: null,
		claims: [],
	},

	actions: {
		async authAction({ commit }) {
			firebase.auth().onAuthStateChanged((user) => {
				//console.log("ok1")
				if (user) {
					commit("setUser", user)
				} else {
					commit("setUser", null)
				}

				if (this.state.user) {
					//console.log("ok")

					firebase
						.auth()
						.currentUser.getIdTokenResult()
						.then((result) => {
							commit("setClaims", result.claims)
						})
				}
			})

			// firebase.auth().onAuthStateChanged((user) => {
			// 	if (user) {
			// 		commit("setUser", user)
			// 	} else {
			// 		commit("setUser", null)
			// 	}
			// })
		},

		async signInAction({ commit }) {
			var provider = new firebase.auth.GoogleAuthProvider()
			try {
				await firebase.auth().signInWithPopup(provider)
				const result = await firebase.auth().currentUser.getIdTokenResult()
				commit("setClaims", result.claims)
			} catch (error) {
				commit("setError", error.message)
			}
		},
		signOutAction({ commit }) {
			firebase
				.auth()
				.signOut()
				.then(() => {
					commit("setUser", null)
				})
				.catch((error) => {
					commit("setError", error.message)
				})
		},

	},
	getters: {
		getUser(state) {
			return state.user
		},
		getDisplayName(state) {
			if (state.user) {
				return state.user.displayName
			}
			return ""
		},
		getError(state) {
			return state.error
		},
		isUserAuth(state) {
			return !!state.user
		},
		isUserAdmin(state) {
			if (state.user && state.user.email === "admin@telecom-etude.fr") {
				return true
			}
			return false
		},
		isUserModerator(state) {
			// Confirm the user is an Admin.
			if (state.user && state.claims.moderator) {
				return true
			} else {
				return false
			}
		},
	},
	mutations: {
		setUser(state, payload) {
			state.user = payload
		},
		setError(state, payload) {
			state.error = payload
		},
		setClaims(state, payload) {
			state.claims = payload
		},
	},
})

// Initialize Vue =======================================================
Vue.prototype.$firebase = firebase
Vue.config.productionTip = false

new Vue({
	vuetify,
	store,
	router,
	render: (h) => h(App),
}).$mount("#app")
