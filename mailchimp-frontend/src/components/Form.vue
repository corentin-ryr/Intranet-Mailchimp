<template>
	<div>
		<v-card class="card mx-auto mt-0" width="1000">
			<v-form id="mailForm" ref="mailFormRef" v-on:submit.prevent="submit" v-model="isValid">
				<div>
					<v-card-title
						style="font-family: 'Avenir Next Regular'; justify-content: center; align-items: center;"
						class="text-wrap pt-10 pb-0"
					>
						<h1>
							{{ h1 }}
						</h1>
					</v-card-title>
					<v-card-title
						v-if="this.campaignId != null"
						style="font-family: 'Avenir Next Regular'; justify-content: center; align-items: center;"
						class="text-wrap pt-0 pb-7"
					>
						<h3>n° {{ this.campaignId }}</h3>
					</v-card-title>
					<v-spacer v-if="this.campaignId == null" class="pt-0 pb-7" />
				</div>

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

				<div class="text-center pb-2">
					<v-dialog height="90%" width="90%">
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								class="white--text"
								color="#969696"
								depressed
								v-bind="attrs"
								v-on="on"
								v-on:click="createPreviewHTML"
								aria-label="Preview button"
								:disabled="!isValid"
							>
								Prévisualiser
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
				</div>

				<v-divider></v-divider>
				<v-card-actions>
					<v-tooltip bottom max-width="400">
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								type="submit"
								form="mailForm"
								class="mx-auto my-3 white--text"
								:disabled="!isValid"
								color="green"
								depressed
								v-bind="attrs"
								v-on="on"
							>
								{{ sendButtonLabel }}
							</v-btn>
						</template>
						<span>{{ sendTooltip }}</span>
					</v-tooltip>
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
	/**
	 * The Form component contains the form to create or modify a campaign. It contains all the fields necessary to do so (title of the mission, description...).
	 * This form is used in the front page of the site to create a new MRI and in the "Mes MRI" and "Validation" sections.
	 * @example [import](./Form.vue)
	 */
	export default {
		name: "Form",
		props: {
			/**
			 * Dictionary of all the properties of the MRI (title, description...). The list of all the properties is commented in the code.
			 */
			form: {
				// contentTitle: "",
				// contentFirstDescription: "",
				// contentDomain: "",
				// imageDomain: "",
				// contentPay: "",
				// imagePay: "",
				// contentDifficulty: "",
				// imageDifficulty: "",
				// contentSkills: "",
				// contentSchedule: "",
				// contentDescription: "",
				// formBoolean: false,
				// formLink: "",
				// contactList: [],
			},
			/**
			 * Id of the campaign in the firebase database.
			 */
			campaignId: String,
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
			loadingPreviewVisibility: true,
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

		computed: {
			h1: function() {
				if (this.campaignId == null) {
					return "Nouveau MRI"
				} else {
					return "Édition du MRI"
				}
			},
			sendButtonLabel: function() {
				if (this.campaignId == null) {
					return "Soumettre"
				} else {
					return "Mettre à jour"
				}
			},
			sendTooltip: function() {
				if (this.campaignId == null) {
					return "Votre MRI sera envoyé au Responsable Commercial et au Secrétaire Général qui le reliront dès que possible. Si votre MRI n'a pas été envoyé dans les 24 heures suivant sa soumission, contactez-les pour les relancer."
				} else {
					return "Le contenu du MRI sera mis à jour. Les Responsable Commercial et Secrétaire Général ne seront pas notifiés de la modification."
				}
			},
		},

		methods: {
			submit: function() {
				/**
				 * This event is emitted when the form is submitted (on the click of the "ENVOYER" button).
				 */
				this.$emit("submit")
			},
			createPreviewHTML: async function() {
				this.loadingPreviewVisibility = true
				this.previewHTML = ""

				var getPreviewEmail = this.$firebase.functions().httpsCallable("getPreviewEmail")
				try {
					const response = await getPreviewEmail(this.form) //Call the firebase function
					this.previewHTML = response.data
					console.log(this.previewHTML)
					this.loadingPreviewVisibility = false
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
	.v-card__text,
	.v-card__title {
		word-break: normal; /* maybe !important  */
	}
</style>

<docs lang="md">
### Example
You can use this component and link the data of the parent component to the data of the Form component by using this code:

```js
    <Form v-bind:form.sync="this.form" v-on:submit="this.checkAuthentification"></Form>
```


</docs>
