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

				<v-container class="ma-0 pa-2">
					<v-row no-gutters>
						<v-col
							cols="12"
							sm="7"
							md="8"
						>
							<p class="pa-1 ma-0">
								{{ value }}
							</p>
						</v-col>
						<v-col
							cols="12"
							sm="5"
							md="4"

						>
							<div style="display: flex; justify-content: center" class="pa-1 mb-0 pb-0">
								<p style="color: grey" class="ma-0 pa-0">{{getValidationText(true, false)}}</p>
							</div>
							
							<div style="display: flex; justify-content: center">
								<v-responsive max-width=250>
									<div style="display: flex; justify-content: center" class="ma-0 pa-0">
										
										<v-progress-linear
											:value="getValidationPercentage(true, false)"
											class="ma-2 mb-3 mt-1"
											color="grey"
											rounded
										>
										</v-progress-linear>
										
									</div>
								</v-responsive>
							</div>

							<div style="display: flex; justify-content: center">
								<v-btn 
									class="mx-1 pa-1"
									color="#707070"
									outlined
									depressed
									v-on:click="editCampaign(key.id)">
									<span style="font-family: 'Avenir Next Regular';font-size: min(3vw, 14px);">Lire</span>
								</v-btn>

								<v-btn 
									class="mx-1 pa-1"
									color="blue"
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

							</div>
						</v-col>
					</v-row>
				</v-container>

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
				console.log(this.campaigns)
				this.loadingVisibility = false
			},

			editCampaign: function(id) {
				this.$router.push({ path: `/valCampaign/${id}` })
			},

			getValidationPercentage: function(boolRespoCo, boolSecGez) {
				var count = 0
				if (boolRespoCo) {
					count+=1
				}
				if (boolSecGez) {
					count+=1
				}

				if (count==0) {
					return 0
				}
				if (count==1) {
					return 50
				}
				if (count==2) {
					return 100
				}
			},

			getValidationText: function(boolRespoCo, boolSecGez) {
				var text = ""
				if (boolRespoCo && boolSecGez) {
					text="Validé !"
				}
				if (boolRespoCo && !boolSecGez) {
					text="Validation en attente du SG"
				}
				if (!boolRespoCo && boolSecGez) {
					text="Validation en attente du RC"
				}
				if (!boolRespoCo && !boolSecGez) {
					text="Validation en attente"
				}
				return text
			},
		},
	}
</script>

<style></style>
