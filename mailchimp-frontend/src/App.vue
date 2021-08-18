<template>
	<v-app>
		<v-app-bar app id="UI" color="white" clipped-left>
			<router-link to="/">
				<v-img
					class="mx-2 clickable"
					src="./assets/logo_long.svg"
					max-height="100"
					max-width="150"
					contain
				></v-img>
			</router-link>

			<v-spacer></v-spacer>

			<template v-if="isUserAuth">
				<router-link to="/">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
					<v-btn class="clickable" color="#e54540" icon large v-bind="attrs" v-on="on">
						<v-icon>mdi-plus-circle</v-icon>
					</v-btn>
					</template>
					<span>Nouveau MRI</span>
				</v-tooltip>
				</router-link>
			</template>

			<template v-if="isUserAdmin">
				<router-link to="/admin">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
					<v-btn class="clickable" color="#e54540" icon large v-bind="attrs" v-on="on">
						<v-icon>mdi-cog</v-icon>
					</v-btn>
					</template>
					<span>Administrateur</span>
				</v-tooltip>
				</router-link>
			</template>

			<template v-if="isUserModerator || isUserAdmin">
				<router-link to="/validation">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
					<v-btn class="clickable" color="#e54540" icon large v-bind="attrs" v-on="on">
						<v-icon>mdi-check-decagram</v-icon>
					</v-btn>
					</template>
					<span>Validation</span>
				</v-tooltip>
				</router-link>
			</template>

			<template v-if="isUserAuth">
				<router-link to="/myCampaigns">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
					<v-btn class="clickable mr-2" color="#e54540" icon large v-bind="attrs" v-on="on">
						<v-icon>mdi-email</v-icon>
					</v-btn>
					</template>
					<span>Mes MRI</span>
				</v-tooltip>
				</router-link>

				<v-divider
					inset
					vertical
				></v-divider>

				<v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y>
					<template v-slot:activator="{ on, attrs }">
						<v-btn class="clickable ml-2 mr-0" icon v-bind="attrs" v-on="on" color="#e54540" large>
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

			<v-container v-if="!isUserAuth">
				<v-card-title
					style="font-family: 'Avenir Next Bold'; justify-content: west; line-height: 230%; color: #e54540; font-size:x-large"
					class="text-wrap pt-12 pb-8"
				>
					<h1>Mails de <br>Recherche <br>Intervenant</h1>
				</v-card-title>

				<v-alert
					color="red"
					outlined
					text
					type="info"
					class="mx-4 mb-10"
					icon="mdi-account-circle"
					@click.native="signInAction"
				>
					Connectez vous pour commencer <br />
					<p class="caption ma-0 pa-0">
						Pour cela, utilisez votre compte Google Workspace associé à votre adresse <i>@telecom-etude.fr</i>
					</p>
				</v-alert>
			</v-container>

			<div>
				<v-card class="mx-auto" width="400">
					<v-row align="center" justify="space-around" class="ma-10">
						<v-btn
							text
							color="red accent-4"
							class="d-flex align-center my-1"
							href="https://www.linkedin.com/in/corentin-royer-a67a90159/"
							width="100"
						>
							Corentin
						</v-btn>
						<v-btn
							text
							color="red accent-4"
							class="d-flex align-center my-1"
							href="https://www.linkedin.com/in/hugo-queinnec/"
							width="100"
						>
							Hugo
						</v-btn>
						<v-btn
							text
							color="blue accent-4"
							class="d-flex align-center my-1"
							href="https://github.com/corentin-ryr/Intranet-Mailchimp"
							width="100"
						>
							Github
						</v-btn>
					</v-row>
				</v-card>
			</div>

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

		data: () => ({
			menu: false,
		}),

		methods: {
			...mapActions(["authAction", "signInAction", "signOutAction"]),
		},
		computed: {
			...mapGetters(["getUser", "isUserModerator", "isUserAdmin", "isUserAuth", "getDisplayName"]),
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
