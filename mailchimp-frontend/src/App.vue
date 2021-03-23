<template>
	<v-app>
		<v-app-bar app id="UI" color="white" clipped-left>
			<v-img class="mx-2 clickable" src="./assets/logo_long.svg" max-height="100" max-width="150" contain></v-img>

			<v-spacer></v-spacer>

			<template v-if="user.loggedIn">
				<!-- <div class="nav-item">{{ user.data.displayName }}</div>
				<li class="nav-item">
					<a class="nav-link clickable" @click.prevent="logout">Sign out</a>
				</li> -->

				<v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y>
					<template v-slot:activator="{ on, attrs }">
						<v-btn class="clickable" icon v-bind="attrs" v-on="on">
							<v-icon>mdi-account-circle</v-icon>
						</v-btn>
					</template>

					<v-card>
						<v-list>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>{{ user.data.displayName }}</v-list-item-title>
								</v-list-item-content>

								<v-list-item-action>
									<v-btn @click.prevent="logout" icon>
										<v-icon>mdi-logout</v-icon>
									</v-btn>
								</v-list-item-action>
							</v-list-item>
						</v-list>
					</v-card>
				</v-menu>
			</template>
			<template v-else>
				<v-btn id="gradient" class="ma-2 rounded-lg clickable" depressed v-on:click="login">
					<span style="font-family: 'Avenir Next Regular'">Connexion</span>
				</v-btn>
			</template>
		</v-app-bar>

		<v-main>
			<!-- Provides the application the proper gutter -->
			<v-container>
				<MailForm></MailForm>
			</v-container>
		</v-main>
		<v-footer id="UI" app>
			<v-card id="gradient" class="d-flex align-center ma-2 rounded-lg clickable" elevation="0" max-height="35">
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
	import { mapGetters } from "vuex"


	const html = document.documentElement
	html.setAttribute("lang", "sv")

	var link = document.querySelector("link[rel~='icon']")
	if (!link) {
		link = document.createElement("link")
		link.rel = "icon"
		document.getElementsByTagName("head")[0].appendChild(link)
	}
	link.href = "favicon.png"

	export default {
		name: "App",

		props: {
			source: String,
		},
		components: {
			MailForm,
		},
		data: () => ({
			menu: false,
		}),
		methods: {
			async login() {
				var provider = new this.$firebase.auth.GoogleAuthProvider()
				var result = await this.$firebase.auth().signInWithPopup(provider)

				if (result.credential) {
					var credential = result.credential

					// This gives you a Google Access Token. You can use it to access the Google API.
					console.log(credential.accessToken)
				}

				this.menu = false
			},
			async logout() {
				await this.$firebase.auth().signOut()
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
		background-color: rgba(255, 255, 255, 0.15);

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
