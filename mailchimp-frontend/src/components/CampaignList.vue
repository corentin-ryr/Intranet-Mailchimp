<template>
	<div>
		<h1>Mes MRI</h1>
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
	 * This page shows the list of unvalidated campaigns that the user owns 
     * (i.e : the user is in the contact list of that campaign) and that are not yet validated.
	 * The user can open one of these campaign to edit it.
	 * @example [none]
	 */
	export default {
		name: "MailForm",

		data: () => ({
			campaigns: {},
		}),

		created() {
			this.getMyCampaigns()
		},

		methods: {
			getMyCampaigns: async function() {
				//Get campaign to modify
				var getCampaigns = this.$firebase.functions().httpsCallable("getMyCampaigns")
				const result = await getCampaigns()
				this.campaigns = result.data
			},

			editCampaign: function(id) {
				this.$router.push({ path: `/editCampaign/${id}` })
			},
		},
	}
</script>

<style></style>
