<template>
	<div>
		<v-card class="mx-auto mt-10" width="1000">
			<v-form
				id="mailForm"
				ref="mailFormRef"
				v-on:submit.prevent="checkAuthentification"
				v-model="isValid"
				style="padding-left: 20px; padding-right: 20px"
			>
				<v-card-title
					style="font-family: 'Avenir Next Bold'; justify-content: center; align-items: center;"
					class="text-wrap py-10"
				>
					<h1>✉️ MRI</h1>
				</v-card-title>

				<v-text-field
					type="text"
					name="contentTitle"
					v-model="form.contentTitle"
					label="Nom de l'étude"
					required
					:rules="[(v) => !!v || 'Champ requis']"
					prepend-icon="create"
					outlined
				/>

				<v-textarea
					type="text"
					name="contentFirstDescription"
					v-model="form.contentFirstDescription"
					label="Description introductive"
					required
					:rules="[(v) => !!v || 'Champ requis']"
					prepend-icon="emoji_objects"
					auto-grow
					outlined
					rows="3"
					row-height="25"
				/>

				<v-container class="ma-0 pa-0">
					<v-row class="ma-0 pa-0">
						<v-col cols="6" class="ma-0 pa-0">
							<v-text-field
								type="text"
								name="contentDomain"
								v-model="form.contentDomain"
								label="Domaine de l'étude"
								required
								:rules="[(v) => !!v || 'Champ requis']"
								prepend-icon="build"
								outlined
							/>
						</v-col>

						<v-col cols="6" class="ma-0 pa-0">
							<v-select
								:items="domains"
								name="imageDomain"
								v-model="imageDomainFull"
								label="Image du domaine"
								required
								:rules="[(v) => !!v || 'Champ requis']"
								prepend-icon="mdi-"
								outlined
							/>
						</v-col>
					</v-row>

					<v-row class="ma-0 pa-0">
						<v-col cols="6" class="ma-0 pa-0">
							<v-text-field
								type="text"
								name="contentPay"
								v-model="form.contentPay"
								label="Fourchette de rémunération"
								required
								:rules="[(v) => !!v || 'Champ requis']"
								prepend-icon="payments"
								outlined
							/>
						</v-col>

						<v-col cols="6" class="ma-0 pa-0">
							<v-select
								:items="pays"
								name="imagePay"
								v-model="imagePayFull"
								label="Image de la rémunération"
								required
								:rules="[(v) => !!v || 'Champ requis']"
								prepend-icon="mdi-"
								outlined
							/>
						</v-col>
					</v-row>

					<v-row class="ma-0 pa-0">
						<v-col cols="6" class="ma-0 pa-0">
							<v-text-field
								type="text"
								name="contentDifficulty"
								v-model="form.contentDifficulty"
								label="Difficulté"
								required
								:rules="[(v) => !!v || 'Champ requis']"
								prepend-icon="psychology"
								outlined
							/>
						</v-col>

						<v-col cols="6" class="ma-0 pa-0">
							<v-select
								:items="difficulties"
								name="imageDifficulty"
								v-model="imageDifficultyFull"
								label="Image de la difficulté"
								required
								:rules="[(v) => !!v || 'Champ requis']"
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
					:rules="[(v) => !!v || 'Champ requis']"
					prepend-icon="account_circle"
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
					:rules="[(v) => !!v || 'Champ requis']"
					prepend-icon="today"
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
					:rules="[(v) => !!v || 'Champ requis']"
					prepend-icon="list_alt"
					auto-grow
					outlined
					rows="3"
					row-height="25"
				/>

				<v-row align="center" class="ma-0 pa-0">
					<v-checkbox v-model="form.formBoolean" hide-details class="shrink mb-8 mt-0"></v-checkbox>
					<v-text-field
						style="width: 80%"
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
					label="Emails des administrateurs"
					multiple
					chips
					required
					prepend-icon="mail"
					auto-grow
					outlined
					:rules="emailRules"
				/>

				<div class="text-center">
					<v-dialog height="90%" width="90%">
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								color="red lighten-2"
								dark
								v-bind="attrs"
								v-on="on"
								v-on:click="createPreviewHTML()"
								aria-label="Preview button"
							>
								Prévisualiser
							</v-btn>
						</template>

						<v-card>
							<v-card-title class="headline grey lighten-2">
								Prévisualisation du MRI
							</v-card-title>
							<div v-html="previewHTML"></div>
						</v-card>
					</v-dialog>
				</div>

				<v-divider></v-divider>
				<v-card-actions>
					<v-btn
						type="submit"
						form="mailForm"
						class="mx-auto"
						:disabled="!isValid"
						color="secondary"
						aria-label="Send button"
					>
						Envoyer
					</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>

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

		<div>
			<v-card class="mx-auto" width="400">
				<v-row align="center" justify="space-around" class="ma-10">
					<v-btn
						text
						color="red accent-4"
						class="d-flex align-center my-1"
						href="https://www.linkedin.com/in/corentin-royer-a67a90159/"
						width="100"
					>
						Corentin
					</v-btn>
					<v-btn
						text
						color="red accent-4"
						class="d-flex align-center my-1"
						href="https://www.linkedin.com/in/hugo-queinnec/"
						width="100"
					>
						Hugo
					</v-btn>
					<v-btn
						text
						color="blue accent-4"
						class="d-flex align-center my-1"
						href="https://github.com/corentin-ryr/Intranet-Mailchimp"
						width="100"
					>
						Github
					</v-btn>
				</v-row>
			</v-card>
		</div>
	</div>
</template>

<script>
	import gsap from "gsap"
	const tl = gsap.timeline({ defaults: { ease: "power1.out" } })

	export default {
		name: "MailForm",
		props: {
			msg: String,
		},

		data: () => ({
			domains: [
				"Data Science, Machine Learning, IA",
				"Développement Web, Logiciel, Mobile",
				"Cybersécurité, Cryptographie",
				"Systèmes Embarqués, IoT",
				"Image, Computer Graphics, 3D",
				"Étude de marché, État de l'Art, Audit",
			],
			pays: ["Faible", "Moyenne", "Élevée"],
			difficulties: ["Faible", "Moyenne", "Élevée"],
			imageDomainFull: "",
			imageDifficultyFull: "",
			imagePayFull: "",

			//Other variables
			enabled: false,
			isValid: true,
			overlayText: "Votre MRI s'envoie",
			loadingVisibility: true,

			backgroundColor: "background: white",
			emailRules: [
				(v) =>
					!v ||
					/^([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)@((telecom-paris\.fr)|(telecom-etude\.fr))(,([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)@(telecom-paris\.fr|telecom-etude\.fr))*$/.test(
						v
					) ||
					"Adresses prenom.nom@telecom-etude.fr et prenom.nom@telecom-paris.fr uniquement",
			],

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
				contactList: [],
			},

			previewHTML: "",
		}),

		watch: {
			imageDomainFull: function() {
				switch (this.imageDomainFull) {
					case this.domains[0]:
						this.form.imageDomain = "data"
						break
					case this.domains[1]:
						this.form.imageDomain = "dev"
						break
					case this.domains[2]:
						this.form.imageDomain = "cyber"
						break
					case this.domains[3]:
						this.form.imageDomain = "se"
						break
					case this.domains[4]:
						this.form.imageDomain = "image"
						break
					case this.domains[5]:
						this.form.imageDomain = "etude"
						break
					default:
						break
				}
			},

			imageDifficultyFull: function() {
				switch (this.imageDifficultyFull) {
					case this.difficulties[0]:
						this.form.imageDifficulty = "low"
						break
					case this.difficulties[1]:
						this.form.imageDifficulty = "middle"
						break
					case this.difficulties[2]:
						this.form.imageDifficulty = "high"
						break
					default:
						return ""
				}
			},

			imagePayFull: function() {
				switch (this.imagePayFull) {
					case this.pays[0]:
						this.form.imagePay = "low"
						break
					case this.pays[1]:
						this.form.imagePay = "middle"
						break
					case this.pays[2]:
						this.form.imagePay = "high"
						break
					default:
						return ""
				}
			},
		},

		methods: {
			checkAuthentification: async function() {
				//is the user logged in ?
				if (!this.$store.getters.user.loggedIn) {
					await this.login()
					this.sendForm()
				} else {
					this.sendForm()
				}
			},

			async login() {
				var provider = new this.$firebase.auth.GoogleAuthProvider()
				await this.$firebase.auth().signInWithPopup(provider)
			},

			sendForm: async function() {
				this.backgroundColor = "background: #e54540"
				this.overlayText = "MRI en cours d'envoi 📨"

				tl.fromTo(".intro", { y: "-100%" }, { y: "0%", duration: 0.75 })
				tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1 })

				var createCampaign = this.$firebase.functions().httpsCallable("createCampaignAndSendTestEmail")
				var success = true
				try {
					await createCampaign(this.form) //Call the firebase function
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
					this.overlayText = "MRI envoyé ! 🚀"
				} else {
					this.loadingVisibility = false
					this.overlayText = "Une erreur s'est produite ⚠️"
				}

				await tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1.5 })

				setTimeout(() => {
					//Set a timeout for the user to have time to read the message
					this.closeOverlay(success)
				}, 1500)
			},

			closeOverlay: async function(success) {
				tl.to(".text", { y: "-100%", duration: 1 })
				tl.to(".intro", { y: "100%", duration: 1 }, "-=0.5")

				if (success) {
					for (let field in this.form) {
						this.form[field] = ""
					}
					this.$refs.mailFormRef.reset()
				} else {
					//Add a hint message to help the user correct its mistakes
					console.log("here is what you need to do...")
				}
				setTimeout(() => {
					this.backgroundColor = "background: white"
					this.loadingVisibility = true
				}, 1500)
			},

			createPreviewHTML: async function() {
				var getPreviewEmail = this.$firebase.functions().httpsCallable("getPreviewEmail")
				try {
					const response = await getPreviewEmail(this.form) //Call the firebase function
					this.previewHTML = response.data
				} catch (error) {
					console.log(error)
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
		width: 100%;
	}

	.v-textarea {
		width: 100%;
	}

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
</style>
