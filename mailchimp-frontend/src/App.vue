<template>
	<v-app>
		<v-app-bar app id="UI" clipped-left>
			<v-avatar :tile="true">
				<img src="./assets/OiseauBlanc.png" />
			</v-avatar>
			<v-toolbar-title class="ml-5"
				><span style="font-family: 'Avenir Next Bold'">telecom</span>
				<span style="font-family: 'Avenir Next Regular'"> etude</span>
			</v-toolbar-title>
		</v-app-bar>

		<v-main>
			<!-- Provides the application the proper gutter -->
			<v-container fluid>
				<MailForm></MailForm>
			</v-container>
		</v-main>
		<v-footer id="UI" app>
			<span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
		</v-footer>
	</v-app>
</template>

<script>
	import MailForm from "./components/MailForm.vue"

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
		background: linear-gradient(90deg, #fd8334, #d51f48);
		color: white;
	}
</style>
