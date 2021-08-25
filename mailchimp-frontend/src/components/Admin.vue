<template>
	<div>
		<v-card-title
			style="font-family: 'Avenir Next Regular'; justify-content: west;"
			class="text-wrap pt-10 pb-0"
		>
			<h1>ADMINISTRATEUR</h1>
		</v-card-title>
		<v-card-title
			style="font-family: 'Avenir Next Regular'; justify-content: west;"
			class="text-wrap pt-5 pb-5 pl-4"
		>
			<h3>Gérer les modérateurs</h3>
		</v-card-title>

		<v-card class="card mx-auto mt-0" width="1000">
			<v-card-title
				style="font-family: 'Avenir Next Regular'; justify-content: west;"
				class="text-wrap pt-3 pb-0"
			>
				<h4>Ajouter un modérateur</h4>
			</v-card-title>

			<v-form id="adminForm" ref="adminFormRef" v-on:submit.prevent="addUserToModerator" v-model="isValid">


				<v-container class="ma-0 pa-0">
					<v-row class="ma-0 pa-0">

						<v-col cols="6" class="ma-0 pl-0">
							<v-text-field
								class="mb-0 pb-0"
								type="text"
								name="email"
								v-model="email"
								label="Email"
								required
								prepend-icon="email"
								outlined
								:rules="emailRules"
							/>
						</v-col>

						<v-col cols="6" class="ma-0 pr-0">
							<v-select
								class="mb-0 pb-0"
								:items="roles"
								name="imageDomain"
								v-model="role"
								label="Rôle"
								required
								:rules="[(v) => !!v || 'Champ requis']"
								outlined
							/>
						</v-col>
					</v-row>
				</v-container>

				<v-card-actions>
					<v-tooltip bottom max-width="400">
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								type="submit"
								form="adminForm"
								class="mx-auto my-0 white--text"
								:disabled="!isValid"
								color="green"
								depressed
								v-bind="attrs"
								v-on="on"
							>
								Ajouter le modérateur
							</v-btn>
						</template>
						<span>blabla</span>
					</v-tooltip>
				</v-card-actions>

			</v-form>
		</v-card>

		<v-card class="card mx-auto mt-6" width="1000">
			<v-card-title
				style="font-family: 'Avenir Next Regular'; justify-content: west;"
				class="text-wrap pt-3 pb-0"
			>
				<h4>Supprimer les modérateurs</h4>
			</v-card-title>

				<v-btn
					id="gradient-outline"
					outlined
					class="ma-2 rounded-lg clickable"
					depressed
					v-on:click="revokeUsers"
				>
					<span style="font-family: 'Avenir Next Regular'">Révoquer tous les accès</span>
				</v-btn>
		</v-card>
	</div>
</template>

<script>
	/**
	 * This page is only accessible by the admins (via the Vuex plugin). 
     * Here, an admin can grant the moderator role to a specific email adress or revoke the access to everyone.
     * This shold be done every year when the new team arrives.
     * @example [none]
	 */
	export default {
		name: "Admin",

		data: () => ({
			email: "",
			roles: ["SecGez", "RespoCo"],
			role: "",

			isValid: false,

			emailRules: [
				(v) =>
					/^([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)@(telecom-etude\.fr)$/.test(v) || "Adresse prenom.nom@telecom-etude.fr uniquement",
			],
		}),

		methods: {

			addUserToModerator: async function() {
				//Get campaign to modify

				//var addUserToModerator = this.$firebase.functions().httpsCallable("addUserToModerator")
				try {
					//const result = await addUserToModerator({ email: this.email, role: this.role })
					//console.log(result)
				} catch (error) {
					//console.log(error)
				}
				console.log("user added " + this.email + this.role)
			},
			revokeUsers: async function() {
				//Get campaign to modify
				
				//var revokeUsers = this.$firebase.functions().httpsCallable("revokeUsers")
				//const result = await revokeUsers()
				//console.log(result)
				console.log("revoked")
			},
		},
	}
</script>

<style>

</style>
