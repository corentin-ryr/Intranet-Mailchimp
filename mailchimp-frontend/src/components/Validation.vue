<template>
	<div>
		<h1>Validation Page</h1>
		<v-card v-for="campaign in campaigns" :key="campaign.name">
			{{ campaign.name }}

			<v-btn id="gradient" class="ma-2 rounded-lg clickable" depressed>
				<span style="font-family: 'Avenir Next Regular'">Ouvrir campagne</span>
			</v-btn>
		</v-card>

		<v-btn v-on:click="testFunc" text color="red accent-4" class="d-flex align-center my-1" width="100">
			Get campaigns to validate
		</v-btn>
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
				//Get campaign to modify
				var getCampaigns = this.$firebase.functions().httpsCallable("getCampaignsToValidate")
				var campaigns = await getCampaigns()
				console.log(campaigns)
				// const campaignId = campaigns["TEST"]

				// //Update campaign
				// var inputdata = this.form
				// inputdata["id"] = campaignId
				// var updateCampaign = this.$firebase.functions().httpsCallable("updateCampaign")
				// var res = await updateCampaign(inputdata)
				// console.log(res)
			},
		},
	}
</script>

<style></style>
