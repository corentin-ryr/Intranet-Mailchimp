<template>
	<div>
		<v-card class="mx-auto mt-10" width="1000">
			<v-form
				id="mailForm"
				v-on:submit.prevent="sendForm"
				v-model="isValid"
				style="padding-left: 20px; padding-right: 20px"
			>
				<v-card-title style="font-family: 'Avenir Next Bold'" class="py-10">
					<h2>Création d'un MRI</h2>
				</v-card-title>

				<v-text-field
					type="text"
					name="contentTitle"
					v-model="form.contentTitle"
					label="Nom de l'étude"
					required
					prepend-icon="mdi-account-outline"
					outlined
					
				/>

				<v-textarea
					type="text"
					name="contentFirstDescription"
					v-model="form.contentFirstDescription"
					label="Description introductive"
					required
					prepend-icon="mdi-account-outline"
					auto-grow
					outlined
					rows="3"
					row-height="25"
					
				/>

				<v-container>
					<v-row>
						<v-col cols="6">
							<v-text-field
								type="text"
								name="Domaine de l'étude"
								v-model="form.contentDomain"
								label="Data Science"
								required
								prepend-icon="mdi-dialpad"
								outlined
							/>
						</v-col>

						<v-col cols="6">
							<v-select
								:items="domains"
								name="imageDomain"
								v-model="form.imageDomain"
								label="Image du domaine"
								required
								prepend-icon="mdi-"
								outlined
							/>
						</v-col>
					</v-row>
					
					<v-row>
						<v-col cols="6">
							<v-text-field
								type="text"
								name="contentPay"
								v-model="form.contentPay"
								label="Fourchette de rémunération"
								required
								prepend-icon="mdi-dialpad"
								outlined
							/>
						</v-col>

						<v-col cols="6">
							<v-select
								:items="pays"
								name="imagePay"
								v-model="form.imagePay"
								label="Image de la rémunération"
								required
								prepend-icon="mdi-"
								outlined
							/>
						</v-col>
					</v-row>

					<v-row>
						<v-col cols="6">
							<v-text-field
								type="text"
								name="contentDifficulty"
								v-model="form.contentDifficulty"
								label="Difficulté"
								required
								prepend-icon="mdi-dialpad"
								outlined
							/>
						</v-col>

						<v-col cols="6">
							<v-select
								:items="difficulties"
								name="imageDifficulty"
								v-model="form.imageDifficulty"
								label="Image de la difficulté"
								required
								prepend-icon="mdi-"
								outlined
							/>
						</v-col>
					</v-row>

				</v-container>


				<v-textarea
					type="text"
					name="contentSkills"
					v-model="form.contentSkills"
					label="Compétences"
					required
					prepend-icon="mdi-dialpad"
					auto-grow
					outlined
					rows="3"
					row-height="25"
					
				/>

				<v-textarea
					type="text"
					name="contentSchedule"
					v-model="form.contentSchedule"
					label="Échéances"
					required
					prepend-icon="mdi-dialpad"
					auto-grow
					outlined
					rows="3"
					row-height="25"
					
				/>

				<v-textarea
					type="text"
					name="contentDescription"
					v-model="form.contentDescription"
					label="Description complète et technique"
					required
					prepend-icon="mdi-dialpad"
					auto-grow
					outlined
					rows="3"
					row-height="25"
					
				/>

				<v-row align="center" class="mx-auto">
					<v-checkbox v-model="form.formBoolean" hide-details class="shrink mr-2 mt-0"></v-checkbox>
					<v-text-field
						type="text"
						name="formLink"
						v-model="form.formLink"
						label="Lien vers un formulaire Google Form"
						:disabled="!form.formBoolean"
						outlined
						
					/>
				</v-row>

				
				<v-combobox
					name="contactList"
					v-model="form.contactList"
					:items="items"
					label="Emails des administrateurs"
					multiple
					chips
					required
					prepend-icon="mdi-dialpad"
					auto-grow
					outlined
					
				
				/>


				<div class="text-center">
					<v-dialog
					v-model="dialog"
					width="500"
					>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
						color="red lighten-2"
						dark
						v-bind="attrs"
						v-on="on"
						>
						Sent Data
						</v-btn>
					</template>

					<v-card>
						<v-card-title class="headline grey lighten-2">
						Résultat
						</v-card-title>
						<v-card-text>
							{{form}}
						</v-card-text>

					</v-card>
					</v-dialog>
				</div>
				

				<v-divider></v-divider>
				<v-card-actions>
					<v-btn type="submit" form="mailForm" class="mx-auto" :disabled="!isValid" color="secondary">
						Envoyer
					</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>
		<div class="intro">
			<div class="intro-text">
				<h1 class="hide">
					<span class="text" id="text">{{ overlayText }}</span>
				</h1>
			</div>
		</div>
	</div>
</template>

<script>
	import firebase from "firebase"

	// import axios from "axios"

	import gsap from "gsap"
	const tl = gsap.timeline({ defaults: { ease: "power1.out" } })

	export default {
		name: "MailForm",
		props: {
			msg: String,
		},
		data: () => ({
			domains: ["data", "dev", "cyber", "se", "image", "etude"],
			pays: ["low", "middle", "high"],
			difficulties: ["low", "middle", "high"],
			enabled: false,
			isValid: true,
			overlayText: "Votre MRI s'envoie",

			// Name of the form data
			form: {
				contentTitle: "",
				contentFirstDescription: "Nous vous proposons aujourd'hui une étude de ...",
				contentDomain: "",
				imageDomain: "",
				contentPay: "",
				imagePay: "",
				contentDifficulty: "",
				imageDifficulty: "",
				contentSkills: "Nous recherchons un·e ou plusieurs intervenant·e·s ...",
				contentSchedule: "Le client désire commencer le plus tôt possible.",
				contentDescription: "",
				formBoolean: false,
				formLink: "",
                contactList: "",
			},
		}),
		methods: {
			sendForm: async function() {
				this.overlayText = "Votre MRI s'envoie"
				tl.fromTo(".intro", { y: "-100%" }, { y: "0%", duration: 0.75 })
				tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1 })

				var createCampaign = firebase.functions().httpsCallable("createCampaignAndSendTestEmail")
				var success = true
				try {
					await createCampaign(this.form) //Call the firebase function
				} catch (error) {
					success = false
				}

				await tl.to(".text", {
					y: "-100%",
					duration: 1,
				})

				if (success) {
					this.overlayText = "Voilà, c'est fait"
				} else {
					this.overlayText = "Il y a eu une erreur :("
				}

				await tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1 })

				setTimeout(() => {
					//Set a timeout for the user to have time to read the message
					this.closeOverlay(success)
				}, 1000)
			},
			closeOverlay: async function(success) {
				tl.to(".text", { y: "-100%", duration: 1 })
				tl.to(".intro", { y: "100%", duration: 1 }, "-=0.5")

				if (success) {
					for (let field in this.form) {
						this.form[field] = ""
					}
				} else {
					//Add a hint message to help the user correct its mistakes
					console.log("here is what you need to do...")
				}
			},
		},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	div {
		margin-bottom: 10px;
	}

	.v-text-field {
		width: 90%;
	}

	.v-textarea {
		width: 100%;
	}

	.intro {
		background: #fd8334;
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
		font-size: 3rem;
	}
	.hide {
		background: #fd8334;
		overflow: hidden;
	}
	.hide span {
		transform: translateY(100%);
		display: inline-block;
	}
</style>
