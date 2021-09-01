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

				<v-divider inset vertical></v-divider>

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

			<v-row no-gutters class="mx-xs-0 mx-sm-8">
				<v-col cols="12" sm="6" md="7" lg="8">
					<v-card-title
						style="font-family: 'Avenir Next Bold'; justify-content: west; line-height: 230%; color: #e54540; font-size:x-large"
						class="text-wrap pt-12 pb-xs-4 pb-sm-8"
					>
						<h1>Mails de <br />Recherche <br />Intervenant</h1>
					</v-card-title>
				</v-col>

				<v-col cols="12" sm="6" md="5" lg="4">
					<v-img
						contain
						class="mt-xs-0 mt-sm-10 mb-6"
						max-height="180"
						src="https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/2c1f241d-fb4d-dfe9-5893-7e6492f8e453.png"
					>
					</v-img>
				</v-col>
			</v-row>

				<v-alert
					color="red"
					outlined
					text
					type="info"
					class="mx-4 mx-sm-10 mb-10"
					icon="mdi-account-circle"
					@click.native="signInAction"
				>
					Connectez-vous pour commencer <br />
					<p class="caption ma-0 pa-0">
						Pour cela, utilisez votre compte Google Workspace associé à votre adresse
						<i>@telecom-etude.fr</i>
					</p>
				</v-alert>
			</v-container>

			<div>
				<v-card class="mx-auto mt-8 pt-1" width="290" align="center">

					<div>
						<v-alert
							class="ma-1"
							dense
							text
							type="warning"
							icon="mdi-alert"
							max-width="180"
							@click="sheet = !sheet"
						>
							<p class="ma-0 pa-0">
								Un problème ?
							</p>
						</v-alert>
						<v-bottom-sheet v-model="sheet">
							<v-sheet
								class="text-center"
								:height="helpHeight"
							>
								<v-btn
									x-small
									class="my-2"
									text
									color="grey"
									@click="sheet = !sheet"
									icon
									>
									<v-icon>
										mdi-window-close
									</v-icon>
								</v-btn>
								<div style="width: 80%; margin: 0 auto; text-align: left;">
									<span>
										En cas de problème technique ou de comportement anormal du site, signale le nous sur GitHub en ouvrant un nouveau problème.
										Tu peux également nous contacter directement.
									</span>
								</div>
								<v-btn
									class="my-3"
									color="red"
									outlined
									depressed
									href="https://github.com/corentin-ryr/Intranet-Mailchimp/issues"
								>
									Signaler un problème
								</v-btn>
							</v-sheet>
						</v-bottom-sheet>
					</div>

					<v-row align="center" justify="space-around" class="ma-2 mt-0">
						<v-chip
							class="my-2"
							color="#144fe3"
							outlined
							link
							href="https://www.linkedin.com/in/corentin-royer-a67a90159/"
						>
							<v-icon left>
								mdi-shield-account
							</v-icon>
							Corentin
						</v-chip>
						<v-chip
							class="my-2"
							color="#144fe3"
							outlined
							link
							href="https://www.linkedin.com/in/hugo-queinnec/"
						>
							<v-icon left>
								mdi-shield-account
							</v-icon>
							Hugo
						</v-chip>
						<v-chip
							class="my-2"
							color="black"
							outlined
							link
							href="https://github.com/corentin-ryr/Intranet-Mailchimp"
						>
							<v-icon left>
								mdi-github
							</v-icon>
							GitHub
						</v-chip>
					</v-row>
				</v-card>
			</div>
		</v-main>
		<v-footer id="UI" app>
			<v-card id="gradient" class="d-flex align-center ma-1 rounded-lg clickable" elevation="10" max-height="35">
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
			sheet: false,
		}),

		methods: {
			...mapActions(["authAction", "signInAction", "signOutAction"]),
		},
		computed: {
			...mapGetters([
				"getUser",
				"isUserModerator",
				"isUserAdmin",
				"isUserAuth",
				"getDisplayName",
				"isUserSecGez",
				"isUserRespoCo",
			]),

			helpHeight () {
				switch (this.$vuetify.breakpoint.name) {
					case 'xs': return 260
					case 'sm': return 200
					case 'md': return 180
					case 'lg': return 180
					case 'xl': return 180
				}
			},
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
		background-color: rgba(255, 255, 255, 0);
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
