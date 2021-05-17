<template>
	<v-app>
		<v-app-bar app id="UI" color="white" clipped-left>
			<v-img class="mx-2 clickable" src="./assets/logo_long.svg" max-height="100" max-width="150" contain></v-img>

			<v-spacer></v-spacer>

			<template v-if="isUserAuth">
				<!-- && user.data.claims.moderator -->
				<router-link to="/validation">
					<v-btn id="gradient" class="ma-2 rounded-lg clickable" depressed>
						<span style="font-family: 'Avenir Next Regular'">Validation</span>
					</v-btn>
				</router-link>
			</template>

			<template v-if="isUserAuth">
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
									<v-list-item-title>{{ getDisplayName }}</v-list-item-title>
								</v-list-item-content>

								<v-list-item-action>
									<v-btn @click.prevent="signOutAction" icon>
										<v-icon>mdi-logout</v-icon>
									</v-btn>
								</v-list-item-action>
							</v-list-item>
						</v-list>
					</v-card>
				</v-menu>
			</template>
			<template v-else>
				<v-btn id="gradient" class="ma-2 rounded-lg clickable" depressed v-on:click="signInAction">
					<span style="font-family: 'Avenir Next Regular'">Connexion</span>
				</v-btn>
			</template>
		</v-app-bar>

		<v-main>
			<!-- Provides the application the proper gutter -->
			<v-container v-if="isUserAuth">
				<router-view></router-view>
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
	import { mapGetters, mapActions } from "vuex"

	export default {
		name: "App",
		props: {
			source: String,
		},
		data: () => ({
			menu: false,
		}),

		methods: {

			...mapActions(["authAction", "signInAction", "signOutAction"]),
		},
		computed: {
			// map `this.user` to `this.$store.getters.user`
			...mapGetters(["getUser", "moderator", "admin", "isUserAuth", "getDisplayName"]),
		},
		mounted() {
			this.authAction()
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
	#gradient-outline {
		border-color: #d51f48;
		color: #d51f48;
	}
	.clickable {
		pointer-events: all;
	}
	.card {
		padding-left: 20px;
		padding-right: 20px;
	}
</style>
