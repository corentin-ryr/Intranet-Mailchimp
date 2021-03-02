<template>
	<div>
		<v-card class="mx-auto mt-10" width="1000">
			<v-form
				id="mailForm"
				v-on:submit.prevent="sendForm"
				v-model="isValid"
				style="padding-left: 20px; padding-right: 20px"
			>
				<v-card-title style="font-family: 'Avenir Next Bold'">
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
					shaped
				/>

				<v-textarea
					type="text"
					name="contentFirstDescription"
					v-model="form.contentFirstDescription"
					label="Nous vous proposons aujourd'hui une étude de..."
					required
					prepend-icon="mdi-account-outline"
					auto-grow
					outlined
					rows="3"
					row-height="25"
					shaped
				/>

				<v-text-field
					type="text"
					name="contentDomain"
					v-model="form.contentDomain"
					label="Data Science"
					required
					prepend-icon="mdi-dialpad"
					outlined
					shaped
				/>

				<v-select
					:items="domains"
					name="imageDomain"
					v-model="form.imageDomain"
					label="Image du domaine"
					required
					prepend-icon="mdi-"
					outlined
					shaped
				/>

				<v-text-field
					type="text"
					name="contentPay"
					v-model="form.contentPay"
					label="1500-2000€"
					required
					prepend-icon="mdi-dialpad"
					outlined
					shaped
				/>

				<v-select
					:items="pays"
					name="imagePay"
					v-model="form.imagePay"
					label="Image du prix"
					required
					prepend-icon="mdi-"
					outlined
					shaped
				/>

				<v-text-field
					type="text"
					name="contentDifficulty"
					v-model="form.contentDifficulty"
					label="Difficile"
					required
					prepend-icon="mdi-dialpad"
					outlined
					shaped
				/>

				<v-select
					:items="difficulties"
					name="imageDifficulty"
					v-model="form.imageDifficulty"
					label="Image du prix"
					required
					prepend-icon="mdi-"
					outlined
					shaped
				/>

				<v-textarea
					type="text"
					name="contentSkills"
					v-model="form.contentSkills"
					label="Nous recherchons un·e ou plusieurs intervenant·e·s connaissant la Data Science."
					required
					prepend-icon="mdi-dialpad"
					auto-grow
					outlined
					rows="3"
					row-height="25"
					shaped
				/>

				<v-textarea
					type="text"
					name="contentSchedule"
					v-model="form.contentSchedule"
					label="Le client désire commencer le plus tôt possible."
					required
					prepend-icon="mdi-dialpad"
					auto-grow
					outlined
					rows="3"
					row-height="25"
					shaped
				/>

				<v-textarea
					type="text"
					name="contentDescription"
					v-model="form.contentDescription"
					label="Le but de l'étude est de la finir."
					required
					prepend-icon="mdi-dialpad"
					auto-grow
					outlined
					rows="3"
					row-height="25"
					shaped
				/>

				<v-row align="center" class="mx-auto">
					<v-checkbox v-model="enabled" hide-details class="shrink mr-2 mt-0"></v-checkbox>
					<v-text-field
						type="text"
						name="formLink"
						v-model="form.formLink"
						label="www.link-to-form.fr"
						:disabled="!enabled"
						outlined
						shaped
					/>
				</v-row>

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
			domains: ["data", "dev", "cyber", "SE", "image", "etude"],
			pays: ["low", "middle", "high"],
			difficulties: ["low", "middle", "high"],
			enabled: false,
			isValid: true,
			overlayText: "Votre MRI s'envoie",

			// Name of the form data
			form: {
				contentTitle: "Test",
				contentFirstDescription: "Test",
				contentDomain: "Data",
				imageDomain: "data",
				contentPay: "Low",
				imagePay: "low",
				contentDifficulty: "Difficult",
				imageDifficulty: "high",
				contentSkills: "Several skills",
				contentSchedule: "Soon",
				contentDescription: "Lots of words",
				formLink: "",
                contactList: ["firstmail@telecom-etude.fr"]
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
		width: 60%;
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
