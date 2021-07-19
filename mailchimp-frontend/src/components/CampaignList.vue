<template>
	<div>
		<v-card-title style="font-family: 'Avenir Next Regular'; justify-content: west;" class="text-wrap pt-10 pb-0">
			<h1>MES MRI</h1>
		</v-card-title>
		<v-card-title
			style="font-family: 'Avenir Next Regular'; justify-content: west;"
			class="text-wrap pt-3 pb-5 pl-4"
		>
			<h3>Liste de mes études</h3>
		</v-card-title>

		<v-expand-transition>
			<div v-if="loadingVisibilityStart">
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

		<div v-if="!loadingVisibilityStart">
			<v-card v-for="key in orderedCampaignsArray" v-bind:key="key.id" class="ma-4" outlined>
				<v-container class="ma-0 pa-2">
					<v-row no-gutters>
						<v-col cols="12" sm="7" md="8">
							<p class="pa-1 ma-0">
								{{ key["name"] }}
							</p>
						</v-col>
						<v-col cols="12" sm="5" md="4">
							<div style="display: flex; justify-content: center" class="pa-1 mb-0 pb-0">
								<p style="color: grey" class="ma-0 pa-0">
									{{ getValidationText(key.validationRespoCo, key.validationSecGez) }}
								</p>
							</div>

							<div style="display: flex; justify-content: center">
								<v-responsive max-width="250">
									<div style="display: flex; justify-content: center" class="ma-0 pa-0">
										<v-progress-linear
											:value="
												getValidationPercentage(key.validationRespoCo, key.validationSecGez)
											"
											class="ma-2 mb-3 mt-1"
											background-color="#d9d9d9"
											color="#e54540"
											rounded
										>
										</v-progress-linear>
									</div>
								</v-responsive>
							</div>

							<div style="display: flex; justify-content: center">
								<v-dialog height="90%" width="90%">
									<template v-slot:activator="{ on, attrs }">
										<v-btn
											class="mx-1 pa-1"
											color="#707070"
											outlined
											depressed
											v-bind="attrs"
											v-on="on"
											v-on:click="createPreviewHTML(key.id)"
											aria-label="Preview button"
										>
											<span style="font-family: 'Avenir Next Regular';font-size: min(3vw, 14px);"
												>Lire</span
											>
										</v-btn>
									</template>

									<v-card>
										<v-card-title class="headline grey lighten-2">
											Prévisualisation du MRI
										</v-card-title>

										<v-expand-transition>
											<div v-html="previewHTML" v-if="!loadingPreviewVisibility"></div>
										</v-expand-transition>

										<v-expand-transition>
											<div v-if="loadingPreviewVisibility">
												<div style="padding: 10% 10%">
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
									</v-card>
								</v-dialog>

								<v-btn
									class="mx-1 pa-1"
									color="blue"
									outlined
									depressed
									v-on:click="editCampaign(key.id)"
								>
									<span style="font-family: 'Avenir Next Regular';font-size: min(3vw, 14px);"
										>Modifier</span
									>
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
	import _ from "lodash"

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
			orderedCampaignsArray: [],
			loadingVisibilityStart: true,
			previewHTML: "",
			loadingPreviewVisibility: true,
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
				//console.log(result.data)
				this.campaigns = result.data
				this.orderCampaigns()
				this.loadingVisibilityStart = false
			},

			orderCampaigns: function() {
				this.orderedCampaignsArray = _.orderBy(this.campaigns, "time", "desc")

				for (const campaign in this.orderedCampaignsArray) {
					const id = this.orderedCampaignsArray[campaign]["id"]
					for (const campaignName in this.campaigns) {
						if (this.campaigns[campaignName]["id"] == id) {
							this.orderedCampaignsArray[campaign]["name"] = campaignName
						}
					}
				}

				this.orderedCampaignsArray = this.orderedCampaignsArray.filter(
					(campaign) => !(campaign["time"] == null)
				) //delete campaigns without time indicator (if any)
			},

			editCampaign: function(id) {
				this.$router.push({ path: `/editCampaign/${id}` })
			},

			getValidationPercentage: function(boolRespoCo, boolSecGez) {
				var count = 0
				if (boolRespoCo) {
					count += 1
				}
				if (boolSecGez) {
					count += 1
				}

				if (count == 0) {
					return 20
				}
				if (count == 1) {
					return 60
				}
				if (count == 2) {
					return 100
				}
			},

			getValidationText: function(boolRespoCo, boolSecGez) {
				var text = ""
				if (boolRespoCo && boolSecGez) {
					text = "Validé !"
				}
				if (boolRespoCo && !boolSecGez) {
					text = "Validation en attente du SG"
				}
				if (!boolRespoCo && boolSecGez) {
					text = "Validation en attente du RC"
				}
				if (!boolRespoCo && !boolSecGez) {
					text = "Validation en attente"
				}
				return text
			},

			createPreviewHTML: async function(id) {
				this.loadingPreviewVisibility = true
				this.previewHTML = ""

				var getCampaignWithId = this.$firebase.functions().httpsCallable("getCampaignWithId")
				var result = true
				try {
					result = await getCampaignWithId(id) //Call the firebase function
					//console.log(result)
				} catch (error) {
					console.log(error)
				}

				var getPreviewEmail = this.$firebase.functions().httpsCallable("getPreviewEmail")
				try {
					const response = await getPreviewEmail(result.data) //Call the firebase function
					this.previewHTML = response.data
					this.loadingPreviewVisibility = false
				} catch (error) {
					console.log(error)
				}
			},
		},
	}
</script>

<style>
	.v-card__text,
	.v-card__title {
		word-break: normal; /* maybe !important  */
	}
</style>
