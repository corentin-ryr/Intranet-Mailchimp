<template>
	<div>
		<v-card class="card mx-auto mt-10" width="1000">
			<v-form id="mailForm" ref="mailFormRef" v-on:submit.prevent="submit" v-model="isValid">
				<v-card-title
					style="font-family: 'Avenir Next Bold'; justify-content: center; align-items: center;"
					class="text-wrap py-10"
				>
					<h1>Edition du MRI {{ this.id }}</h1>
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
								item-text="domain"
								item-value="abbr"
								name="imageDomain"
								v-model="form.imageDomain"
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
								item-text="pay"
								item-value="abbr"
								name="imagePay"
								v-model="form.imagePay"
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
								item-text="difficulty"
								item-value="abbr"
								name="imageDifficulty"
								v-model="form.imageDifficulty"
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
								v-on:click="createPreviewHTML"
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
	export default {
		name: "Form",
		props: {
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
			id: String,
		},

		data: () => ({
			domains: [
				{ domain: "Data Science, Machine Learning, IA", abbr: "data" },
				{ domain: "Développement Web, Logiciel, Mobile", abbr: "dev" },
				{ domain: "Cybersécurité, Cryptographie", abbr: "cyber" },
				{ domain: "Systèmes Embarqués, IoT", abbr: "se" },
				{ domain: "Image, Computer Graphics, 3D", abbr: "image" },
				{ domain: "Étude de marché, État de l'Art, Audit", abbr: "etude" },
			],

			pays: [
				{ pay: "Faible", abbr: "low" },
				{ pay: "Moyenne", abbr: "middle" },
				{ pay: "Élevée", abbr: "high" },
			],

			difficulties: [
				{ difficulty: "Faible", abbr: "low" },
				{ difficulty: "Moyenne", abbr: "middle" },
				{ difficulty: "Élevée", abbr: "high" },
			],

			//Other variables
			enabled: false,
			isValid: true,
			// overlayText: "Votre MRI s'envoie",
			// loadingVisibility: true,

			// backgroundColor: "background: white",
			emailRules: [
				(v) =>
					!v ||
					/^([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)@((telecom-paris\.fr)|(telecom-etude\.fr))(,([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)@(telecom-paris\.fr|telecom-etude\.fr))*$/.test(
						v
					) ||
					"Adresses prenom.nom@telecom-etude.fr et prenom.nom@telecom-paris.fr uniquement",
			],

			previewHTML: "",
		}),

		methods: {
			submit: function() {
				this.$emit("submit")
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

</style>
