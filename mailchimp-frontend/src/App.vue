<template>
	<v-app>
		<v-app-bar app id="UI" clipped-left flat>
			<v-img class="mx-2" src="./assets/logo_long.svg" max-height="100" max-width="150" contain></v-img>

			<v-spacer></v-spacer>
			<v-btn id="gradient" class="ma-2 rounded-lg" depressed>
				<span style="font-family: 'Avenir Next Regular'">Connexion</span>
			</v-btn>
		</v-app-bar>

		<v-main>
			<!-- Provides the application the proper gutter -->
			<v-container fluid>
				<MailForm></MailForm>
			</v-container>
		</v-main>
		<v-footer id="UI" app>
			<v-card id="gradient" class="ma-2 rounded-lg" elevation="0" max-height="35">
				<v-card-text class="mt-n2  ">
					<span id="gradient" style="font-family: 'Avenir Next Regular'"
						>&copy; {{ new Date().getFullYear() }}</span
					>
				</v-card-text>
			</v-card>
		</v-footer>
	</v-app>
</template>

<script>
	import MailForm from "./components/MailForm.vue"

	const html = document.documentElement
	html.setAttribute('lang', 'sv')

	export default {
		name: "App",
		components: {
			MailForm,
		},

		props: {
			source: String,
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
	}
	#gradient {
		background: linear-gradient(90deg, #fd8334, #d51f48);
		color: white;
	}
</style>
