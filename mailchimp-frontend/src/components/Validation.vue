<template>
	<div>
		<h1>Validation Page</h1>
		<v-card v-for="campaign in campaigns" :key="campaign.name">
			{{ campaign.name }}

			<v-btn id="gradient" class="ma-2 rounded-lg clickable" depressed>
				<span style="font-family: 'Avenir Next Regular'">Ouvrir campagne</span>
			</v-btn>
		</v-card>
	</div>
</template>

<script>
	export default {
		name: "MailForm",
		props: {
			msg: String,
		},

		data: () => ({
			campaigns: [
				{
					name: "Nom1",
				},
				{
					name: "Nom2",
				},
			],
		}),

		methods: {
			testFunc: async function() {
				console.log("OK")
			},
		},
	}
</script>

<style></style>
