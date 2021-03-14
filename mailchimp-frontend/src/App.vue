<template>
	<v-app>
		<v-app-bar app id="UI" color="white" clipped-left dark>
			<v-img
				class="mx-2"
				src="./assets/logo_long.svg"
				max-height="100"
				max-width="150"
				contain
				style="pointer-events: all"
			></v-img>

			<v-spacer></v-spacer>

			<template v-if="user.loggedIn">
				<div class="nav-item">{{ user.data.displayName }}</div>
				<li class="nav-item">
					<a class="nav-link clickable" @click.prevent="logout">Sign out</a>
				</li>
			</template>
			<template v-else>
				<v-btn id="gradient" class="ma-2 rounded-lg clickable" depressed v-on:click="login">
					<span style="font-family: 'Avenir Next Regular'">Connexion</span>
				</v-btn>
			</template>
		</v-app-bar>

		<v-main>
			<!-- Provides the application the proper gutter -->
			<v-container fluid>
				<MailForm></MailForm>
			</v-container>
		</v-main>
		<v-footer id="UI" app>
			<v-card id="gradient" class="d-flex align-center ma-2 rounded-lg" elevation="0" max-height="35">
				<v-card-text>
					<span style="font-family: 'Avenir Next Regular'; color: white"
						>&copy; {{ new Date().getFullYear() }}</span
					>
				</v-card-text>
			</v-card>
		</v-footer>
	</v-app>
</template>

<script>
	import MailForm from "@/components/MailForm.vue"
	import firebase from "firebase/app"
	import { mapGetters } from "vuex"

	const html = document.documentElement
	html.setAttribute("lang", "sv")

	export default {
		name: "App",

		props: {
			source: String,
		},
		components: {
			MailForm,
		},
		methods: {
			async login() {
				var provider = new firebase.auth.GoogleAuthProvider()
				var result = await firebase.auth().signInWithPopup(provider)

				if (result.credential) {
					var credential = result.credential

					// This gives you a Google Access Token. You can use it to access the Google API.
					console.log(credential.accessToken)
				}
			},
			async logout() {
				await firebase.auth().signOut()
			},
		},
		computed: {
			// map `this.user` to `this.$store.getters.user`
			...mapGetters({
				user: "user",
			}),
		},
	}
</script>

<style>
	@font-face {
		font-family: "Avenir Next Regular";
		src: url("./fonts/avenir-regular.otf") format("opentype"); /* File to be stored at your site */
	}
	@font-face {
		font-family: "Avenir Next Bold";
		src: url("./fonts/avenir-bold.otf") format("opentype"); /*File to be stored at your site */
	}

	#UI {
		background: rgba(117, 190, 218, 0);
		/* background: linear-gradient(90deg, #fd8334, #d51f48); */
		color: black;
		pointer-events: none;
	}
	a {
		text-decoration: none;
	}
	#gradient {
		background: linear-gradient(90deg, #fd8334, #d51f48);
		color: white;
	}
	.clickable {
		pointer-events: all;
	}
</style>
