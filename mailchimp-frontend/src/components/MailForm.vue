<template>
	<div>
		<v-card class="mx-auto mt-10" width="1000">
			<v-form
				id="MailForm"
				action="https://perso.telecom-paristech.fr/croyer/public/response.php"
				method="POST"
				v-model="isValid"
				style="padding-left: 20px; padding-right: 20px"
			>
				<v-card-title style="font-family: 'Avenir Next Bold'">
					<h2>Création d'un MRI</h2>
				</v-card-title>

				<v-text-field
					type="text"
					name="contentTitle"
					v-model="contentTitle"
					label="Nom de l'étude"
					:rules="nameRules"
					required
					prepend-icon="mdi-account-outline"
                    outlined
                    shaped
				/>

				<v-textarea
					type="text"
					name="contentFirstDescription"
					v-model="contentFirstDescription"
					label="Nous vous proposons aujourd'hui une étude de..."
					:rules="nameRules"
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
					v-model="contentDomain"
					label="Data Science"
					:rules="numberRules"
					required
					prepend-icon="mdi-dialpad"
                    outlined
                    shaped
				/>

				<v-select
					:items="domains"
					name="imageDomain"
					v-model="imageDomain"
					label="Image du domaine"
					required
					prepend-icon="mdi-"
                    outlined
                    shaped
				/>

				<v-text-field
					type="text"
					name="contentPay"
					v-model="contentPay"
					label="1500-2000€"
					required
					prepend-icon="mdi-dialpad"
                    outlined
                    shaped
				/>

				<v-select
					:items="pays"
					name="imagePay"
					v-model="imagePay"
					label="Image du prix"
					required
					prepend-icon="mdi-"
                    outlined
                    shaped
				/>

				<v-text-field
					type="text"
					name="contentDifficulty"
					v-model="contentDifficulty"
					label="Difficile"
					required
					prepend-icon="mdi-dialpad"
                    outlined
                    shaped
				/>

				<v-select
					:items="difficulties"
					name="imageDifficulty"
					v-model="imageDifficulty"
					label="Image du prix"
					required
					prepend-icon="mdi-"
                    outlined
                    shaped
				/>

				<v-textarea
					type="text"
					name="contentSkills"
					v-model="contentSkills"
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
					v-model="contentSchedule"
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
					v-model="contentDescription"
					label="Le but de l'étude est de la finir."
					required
					prepend-icon="mdi-dialpad"
					auto-grow
					outlined
					rows="3"
					row-height="25"
					shaped
				/>

				<v-row align="center" class="mx-auto" >
					<v-checkbox v-model="enabled" hide-details class="shrink mr-2 mt-0"></v-checkbox>
					<v-text-field
						type="text"
						name="formLink"
						v-model="formLink"
						label="www.link-to-form.fr"
						:disabled="!enabled"
                        outlined
                        shaped
					/>
				</v-row>

				<v-divider></v-divider>
				<v-card-actions>
					<v-btn type="submit" form="signatureForm" class="mx-auto" :disabled="!isValid" color="secondary">
						Envoyer
					</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>

	</div>
</template>

<script>
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
		}),
		methods: {},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	div {
		margin-bottom: 10px;
		position: relative;
	}

	.signatureDiv {
		text-align: left;
		font-family: Helvetica, Arial, serif;
		font-size: 13px;
		color: rgb(153, 153, 153);
		line-height: 1.5;
	}

	.redText {
		color: #e54540;
	}

	.v-text-field {
		width: 60%;
	}

    .v-textarea {
		width: 100%;
	}

</style>
