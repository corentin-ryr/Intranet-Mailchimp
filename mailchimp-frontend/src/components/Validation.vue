<template>
	<div>
		<h1>Validation Page</h1>
		<v-card v-for="(key, value) in campaigns" v-bind:key="value.id">
			{{ value }}

			<v-btn id="gradient" class="ma-2 rounded-lg clickable" depressed v-on:click="editCampaign(key.id)">
				<span style="font-family: 'Avenir Next Regular'">Ouvrir campagne</span>
			</v-btn>
		</v-card>
	</div>
</template>

<script>
	/**
	 * This page is only accessible by the moderators of the MRI. This is done via the Vuex plugin.
	 * This page shows all the campaigns that have not been calidated yet.
	 * Then, a moderator can open one of these campaigns to inspect and validate it.
	 * @example [none]
	 */
	export default {
		name: "Validation",

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
			},

			editCampaign: function(id) {
				this.$router.push({ path: `/valCampaign/${id}` })
			},
		},
	}
</script>

<style></style>
