<template>
	<div>
		<h1>Mes MRI</h1>

		<v-expand-transition>
			<div v-if="loadingVisibility">
				<div style="margin: 5% 10%">
				<v-progress-linear
					aria-label="Progress bar"
					color="#e54540"
					indeterminate
					rounded
					align="center"
					height="10"
					width="6"
				></v-progress-linear>
				</div>
			</div>
		</v-expand-transition>

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
			loadingVisibility: true,
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
				this.loadingVisibility = false
			},

			editCampaign: function(id) {
				this.$router.push({ path: `/editCampaign/${id}` })
			},
		},
	}
</script>

<style></style>
