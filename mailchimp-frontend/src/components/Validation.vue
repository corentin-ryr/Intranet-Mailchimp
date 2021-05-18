<template>
	<div>
		<h1>Validation Page</h1>
		<v-card v-for="(key, value) in campaigns" v-bind:key="key">
			{{ value }}

				<v-btn id="gradient" class="ma-2 rounded-lg clickable" depressed v-on:click="editCampaign(key)">
					<span style="font-family: 'Avenir Next Regular'">Ouvrir campagne</span>
				</v-btn>
		</v-card>
	</div>
</template>

<script>
	export default {
		name: "MailForm",

		data: () => ({
			campaigns: {},
		}),

		created() {
			this.getCampaignsToValidate()
		},

		methods: {
			getCampaignsToValidate: async function() {
				//Get campaign to modify
				var getCampaigns = this.$firebase.functions().httpsCallable("getCampaignsToValidate")
				const result = await getCampaigns()
				this.campaigns = result.data

				console.log(this.campaigns)
			},

			editCampaign: function(id) {
				this.$router.push({ path: `/valCampaign/${id}` })
			},
		},
	}
</script>

<style></style>
