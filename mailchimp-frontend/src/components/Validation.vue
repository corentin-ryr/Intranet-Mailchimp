<template>
	<div>
		<v-card-title
			style="font-family: 'Avenir Next Regular'; justify-content: west;"
			class="text-wrap pt-10 pb-0"
		>
			<h1>VALIDATION</h1>
		</v-card-title>
		<v-card-title
			style="font-family: 'Avenir Next Regular'; justify-content: west;"
			class="text-wrap pt-3 pb-5 pl-4"
		>
			<h3>Liste de toutes les études</h3>
		</v-card-title>

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

		<div v-if="!loadingVisibility">
			<v-card v-for="(key, value) in campaigns" v-bind:key="value.id" class="ma-4" outlined>
				<div class="pa-2">
					<p class="pa-1 ma-0">
						{{ value }}
					</p>
					<div style="display: flex; justify-content: flex-end">
						<v-btn 
							class="mx-1 pa-1"
							color="#707070"
							outlined
							depressed
							v-on:click="editCampaign(key.id)">
							<span style="font-family: 'Avenir Next Regular';font-size: min(3vw, 14px);">Modifier</span>
						</v-btn>

						<v-btn
							class="mx-1 pa-1"
							color="green"
							outlined
							depressed
							v-on:click="editCampaign(key.id)">
							<span style="font-family: 'Avenir Next Regular';font-size: min(3vw, 14px);">Valider</span>
						</v-btn>

						<v-btn 
							class="mx-1 pa-1"
							color="red"
							outlined
							depressed
							v-on:click="editCampaign(key.id)">
							<span style="font-family: 'Avenir Next Regular';font-size: min(3vw, 14px);">Supprimer</span>
						</v-btn>
					</div>
				</div>
			</v-card>
		</div>

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
			loadingVisibility: true,
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
				this.loadingVisibility = false
			},

			editCampaign: function(id) {
				this.$router.push({ path: `/valCampaign/${id}` })
			},
		},
	}
</script>

<style></style>
