<template>
	<div v-if="isUserModerator||isUserAdmin">

		<v-row no-gutters class="mx-4">

		<v-col cols="12" sm="8" md="8">
		<v-card-title style="font-family: 'Avenir Next Regular'; justify-content: west;" class="text-wrap pt-10 pb-0">
			<h1>VALIDATION</h1>
		</v-card-title>
		<v-card-title
			style="font-family: 'Avenir Next Regular'; justify-content: west;"
			class="text-wrap pt-3 pb-5 pl-4"
		>
			<h3>Liste des études non envoyées</h3>
		</v-card-title>
		</v-col>

		<v-col cols="12" sm="4" md="4">
		<v-alert
			color="green"
			dense
			text
			type="info"
			class="mx-auto mt-xs-0 pa-3 mt-sm-9"
			icon="mdi-check-decagram"
			max-width="270"
		>
			Bienvenue {{this.getUser["displayName"].replace(/ .*/,'')}} <br />
			<p class="caption ma-0 pa-0">
				{{this.welcomeText}}
			</p>
		</v-alert>
		</v-col>

		</v-row>

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

		<div v-if="nothingToShow">
			<v-alert
			class="ma-4"
			text
			type="info"
			outlined
			>
			Aucun MRI à valider <br />
			<p class="caption ma-0 pa-0">
				Seuls les MRI non-envoyés à la liste de distribution s'affichent
			</p>
			
			</v-alert>
		</div>

		<div v-if="!loadingVisibilityStart">
			<v-card v-for="key in orderedCampaignsArray" v-bind:key="key.id" class="ma-4" outlined>

				<div style="display: flex; justify-content: flex-end" class="ma-0 pa-0">
					<template>
						<div class="text-center">
							<v-dialog width="500" v-model="dialogDelete[key['name']]">
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										class="ma-1 pa-0"
										color="grey"
										icon
										x-small
										v-bind="attrs"
										v-on="on"
									>
										<v-icon
											>mdi-window-close
										</v-icon>
									</v-btn>
								</template>

								<v-card>
									<v-card-title class="text-h5">
										Confirmer la suppression
									</v-card-title>

									<v-card-text>
										Le MRI <i>"{{ key['name'] }}"</i> sera <b>supprimé</b> de ce site de manière irréversible. Attention, la campagne associée sur mailchimp.com ne sera pas supprimée.
									</v-card-text>

									<v-divider></v-divider>

									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn
											color="grey"
											outlined
											depressed
											@click="dialogDelete[key['name']] = false"
										>
											Annuler
										</v-btn>
										<v-btn
											color="red"
											outlined
											depressed
											@click="deleteMRI(key.id, key['name'])"
										>
											Supprimer
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</div>
					</template>
				</div>

				<v-container class="ma-0 pa-2 pt-0 mt-n4">
					<v-row no-gutters>

						<v-col cols="12" sm="7" md="8">
							<p class="py-1 px-3 ma-0">
								{{ key['name'] }}
							</p>
						</v-col>

						<v-col cols="12" sm="5" md="4">
							<div style="display: flex; justify-content: center" class="pa-1 mb-0 pb-0">
								<p style="color: grey" class="ma-0 pa-0">{{ getValidationText(key.validationRespoCo, key.validationSecGez) }}</p>
							</div>

							<div style="display: flex; justify-content: center">
								<v-responsive max-width="250">
									<div style="display: flex; justify-content: center" class="ma-0 pa-0">
										<v-progress-linear
											:value="getValidationPercentage(key.validationRespoCo, key.validationSecGez)"
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
											<span style="font-family: 'Avenir Next Regular';font-size: min(3vw, 13px);"
												>Lire</span
											>
										</v-btn>
									</template>

									<v-card>
										<v-card-title class="headline grey lighten-2">
											Prévisualisation du MRI
										</v-card-title>

										<v-expand-transition>
											<iframe ref="iframe" :srcdoc="previewHTML" v-if="!loadingPreviewVisibility" style="height: 70vh; width: 100%" frameborder="0" scrolling="yes"></iframe>
											<!--div v-html="previewHTML" v-if="!loadingPreviewVisibility"></div-->
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
									<span style="font-family: 'Avenir Next Regular';font-size: min(3vw, 13px);"
										>Modifier</span
									>
								</v-btn>

								<template v-if="!(key.validationRespoCo && key.validationSecGez)">
									<div class="text-center">
										<v-dialog width="500" v-model="dialogValidation[key['name']]">
											<template v-slot:activator="{ on, attrs }">
												<v-btn
													class="mx-1 pa-1"
													color="green"
													outlined
													depressed
													v-bind="attrs"
													v-on="on"
													:disabled="disableValidationButton(key.validationRespoCo, key.validationSecGez)"
												>
													<span
														style="font-family: 'Avenir Next Regular';font-size: min(3vw, 13px);"
														>Valider</span
													>
												</v-btn>
											</template>

											<v-card>
												<v-card-title class="text-h5">
													Confirmer la validation
												</v-card-title>

												<v-card-text>
													Le MRI <i>"{{ key['name'] }}"</i> pourra être envoyé dès
													qu'il aura obtenu la <b>validation</b> du Responsable Commercial et du
													Secrétaire Général. Toute modification du MRI par un membre nécessitera la nouvelle validation du MRI par l'autre.
												</v-card-text>

												<v-divider></v-divider>

												<v-card-actions>
													<v-spacer></v-spacer>
													<v-btn
														color="red"
														outlined
														depressed
														@click="dialogValidation[key['name']] = false"
													>
														Annuler
													</v-btn>
													<v-btn
														color="green"
														outlined
														depressed
														@click="validateMRI(key.id, key['name'])"
													>
														Valider
													</v-btn>
												</v-card-actions>
											</v-card>
										</v-dialog>
									</div>
								</template>

								<template v-if="(key.validationRespoCo && key.validationSecGez)">
									<div class="text-center">
										<v-dialog width="500" v-model="dialogValidation[key['name']]">
											<template v-slot:activator="{ on, attrs }">
												<v-btn
													class="mx-1 pa-1 white--text"
													color="green"
													depressed
													v-bind="attrs"
													v-on="on"
												>
													<span
														style="font-family: 'Avenir Next Regular';font-size: min(3vw, 13px);"
														>Envoyer</span
													>
												</v-btn>
											</template>

											<v-card>
												<v-card-title class="text-h5">
													Confirmer l'envoi
												</v-card-title>

												<v-card-text>
													Confirmez vous l'<b>envoi final</b> du MRI <i>"{{ key['name'] }}"</i> à tous les intervenants enregistrés ? L'envoi est définitif et ne peut pas être annulé.
												</v-card-text>

												<v-divider></v-divider>

												<v-card-actions>
													<v-spacer></v-spacer>
													<v-btn
														color="red"
														outlined
														depressed
														@click="dialogValidation[key['name']] = false"
													>
														Annuler
													</v-btn>
													<v-btn
														color="green"
														outlined
														depressed
														@click="distributeMRI(key.id, key['name'])"
													>
														Envoyer
													</v-btn>
												</v-card-actions>
											</v-card>
										</v-dialog>
									</div>
								</template>

							</div>
						</v-col>
					</v-row>
				</v-container>
			</v-card>

			<div>
				<v-alert
				class="ma-4"
				text
				type="info"
				outlined
				@click.native="infoPopupSendAgain"
				>
				Comment envoyer à nouveau un MRI que j'ai déjà envoyé ?
				</v-alert>
			</div>
		</div>

		<div class="intro" :style="backgroundColor">
			<!-- This div contains the elements for the animation sequence on form sending  -->
			<div class="intro-text" style="padding: 10% 10%">
				<h1 class="hide">
					<span class="text" id="text">{{ overlayText }}</span>
				</h1>
				<v-progress-linear
					aria-label="Progress bar"
					v-if="loadingVisibility"
					class="my-8"
					color="white"
					indeterminate
					rounded
					align="center"
					height="6"
					width="6"
				></v-progress-linear>
			</div>
		</div>
	</div>
</template>

<script>
	import gsap from "gsap"
	import { mapGetters, mapActions } from "vuex"
	import _ from 'lodash'
	const tl = gsap.timeline({ defaults: { ease: "power1.out" } })
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
			orderedCampaignsArray: [],
			loadingVisibilityStart: true,
			previewHTML: "",
			loadingPreviewVisibility: true,
			dialogValidation: [],
			dialogDelete: [],

			overlayText: "",
			backgroundColor: "white",
			loadingVisibility: true,
			nothingToShow: false,
		}),

		created() {
			this.getCampaignsToValidate()
		},

		computed: {
			...mapGetters([
				"getUser",
				"isUserModerator",
				"isUserSecGez",
				"isUserRespoCo",
				"isUserAdmin",
			]),

			welcomeText: function() {
				var text = ""
				if (this.isUserRespoCo) {
					text = "Responsable Commercial"
				}
				else if (this.isUserSecGez) {
					text = "Secrétaire Général"
				}
				else if (this.isUserAdmin) {
					text = "Vous n'êtes pas autorisé à modifier, valider ou envoyer les campagnes"
				}
				else {
					text = "Accès non autorisé à cette page"
				}

				return text
			},

		},

		methods: {
			...mapActions(["authAction", "signInAction", "signOutAction"]),

			disableValidationButton: function(validationRespoCo, validationSecGez) {
				var validation = false
				if (this.isUserRespoCo) {
					if (validationRespoCo){
						validation = true
					}
				}
				else if (this.isUserSecGez) {
					if(validationSecGez){
						validation = true
					}
				}
				else {
					validation = true
				}
				return validation
			},

			getCampaignsToValidate: async function() {
				//Get campaign to modify
				var getCampaigns = this.$firebase.functions().httpsCallable("getCampaignsToValidate")
				var result = null
				try{
					result = await getCampaigns()
				}
				catch(error) {
					console.log("No campaign to show")
					this.loadingVisibilityStart = false
					this.nothingToShow = true
				}
				
				if (!this.nothingToShow){
					//console.log(result.data)
					this.campaigns = result.data
					this.orderCampaigns()
					console.log(this.orderedCampaignsArray)
					this.loadingVisibilityStart = false
				}
			},

			orderCampaigns: function () {
				this.orderedCampaignsArray = _.orderBy(this.campaigns, 'time', 'desc')

				for (const campaign in this.orderedCampaignsArray) {
					const id = this.orderedCampaignsArray[campaign]['id']
					for (const campaignName in this.campaigns) {
						if (this.campaigns[campaignName]['id']==id){
							this.orderedCampaignsArray[campaign]['name']=campaignName
						}
					}
				}

				this.orderedCampaignsArray = this.orderedCampaignsArray.filter(campaign => !(campaign['time'] == null)); //delete campaigns without time indicator (if any)
			},

			editCampaign: function(id) {
				this.$router.push({ path: `/valCampaign/${id}` })
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

			validateMRI: async function(id, value) {
				this.dialogValidation[value] = false //close dialog

				this.backgroundColor = "background: #e54540"
				this.overlayText = "MRI en cours de validation ⚙️"

				tl.fromTo(".intro", { y: "-100%" }, { y: "0%", duration: 0.75 })
				tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1 })

				var validate = this.$firebase.functions().httpsCallable("validateCampaign")
				var success = true
				try {
					await validate({ id: id }) //Call the firebase function
				} catch (error) {
					console.log(error)
					success = false
				}

				await tl.to(".text", {
					y: "-100%",
					duration: 1,
				})

				if (success) {
					this.loadingVisibility = false
					this.overlayText = "MRI validé ! ✅"
				} else {
					this.loadingVisibility = false
					this.overlayText = "Une erreur s'est produite ⚠️"
				}

				await tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1.5 })

				setTimeout(() => {
					//Set a timeout for the user to have time to read the message
					this.closeOverlay(success)
				}, 1500)

				this.loadingVisibilityStart = true
				this.getCampaignsToValidate()
			},

            distributeMRI: async function(id, value) {
				this.dialogValidation[value] = false //close dialog

				this.backgroundColor = "background: #e54540"
				this.overlayText = "MRI en cours de distribution 🚀"

				tl.fromTo(".intro", { y: "-100%" }, { y: "0%", duration: 0.75 })
				tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1 })

				const distribute = this.$firebase.functions().httpsCallable("distributeCampaign")
				var success = true
				try {
					await distribute({ id: id }) //Call the firebase function
				} catch (error) {
					console.log(error)
					success = false
				}

				await tl.to(".text", {
					y: "-100%",
					duration: 1,
				})

				if (success) {
					this.loadingVisibility = false
					this.overlayText = "MRI envoyé ! ✅"
				} else {
					this.loadingVisibility = false
					this.overlayText = "Une erreur s'est produite ⚠️"
				}

				await tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1.5 })

				setTimeout(() => {
					//Set a timeout for the user to have time to read the message
					this.closeOverlay(success)
				}, 1500)

				this.loadingVisibilityStart = true
				this.getCampaignsToValidate()
			},

			deleteMRI: async function(id, value) {
				this.dialogDelete[value] = false //close dialog

				this.backgroundColor = "background: #e54540"
				this.overlayText = "MRI en cours de suppression ♻️"

				tl.fromTo(".intro", { y: "-100%" }, { y: "0%", duration: 0.75 })
				tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1 })

				const deleteCampaign = this.$firebase.functions().httpsCallable("deleteCampaign")
				var success = true
				try {
					await deleteCampaign({ id: id }) //Call the firebase function
				} catch (error) {
					console.log(error)
					success = false
				}

				await tl.to(".text", {
					y: "-100%",
					duration: 1,
				})

				if (success) {
					this.loadingVisibility = false
					this.overlayText = "MRI supprimé ! 🚮"
				} else {
					this.loadingVisibility = false
					this.overlayText = "Une erreur s'est produite ⚠️"
				}

				await tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1.5 })

				setTimeout(() => {
					//Set a timeout for the user to have time to read the message
					this.closeOverlay(success)
				}, 1500)

				this.loadingVisibilityStart = true
				this.getCampaignsToValidate()
			},

			closeOverlay: async function(success) {
				tl.to(".text", { y: "-100%", duration: 1 })
				tl.to(".intro", { y: "100%", duration: 1 }, "-=0.5")

				if (!success) {
					//Add a hint message to help the user correct its mistakes
					console.log("here is what you need to do...")
				}
				setTimeout(() => {
					this.backgroundColor = "background: white"
					this.loadingVisibility = true
				}, 1500)
			},

			infoPopupSendAgain () {
				alert("Les MRI qui sont validés puis envoyés définitivements ne peuvent pas être renvoyés depuis ce site. Pour cela, il faut se connecter à mailchimp.com avec le compte mri@telecom-etude.fr. En accédant à la liste des campagnes envoyées, il est possible d'en dupliquer une et de l'envoyer à nouveau. Il n'est cependant pas possible avec cette méthode de modifier le MRI à ré-envoyer. Pour cela, il faut créer et envoyer le MRI de zéro depuis ce site.")
			},
		},
	}
</script>

<style scoped>
	.intro {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 5;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		transform: translateY(-100%);
	}
	.intro-text {
		color: white;
		font-family: "Avenir Next Regular";
		font-size: xx-large;
	}
	.hide {
		overflow: hidden;
	}
	.hide span {
		transform: translateY(100%);
		display: inline-block;
	}
	.v-card__text,
	.v-card__title {
		word-break: normal; /* maybe !important  */
	}
</style>

