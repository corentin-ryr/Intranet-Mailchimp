<template>
	<div>
		<v-card class="card mx-auto mt-10" width="800">
			<v-card-title>Admin Page</v-card-title>

			<v-card-actions>
				<v-text-field type="text" name="email" v-model="email" label="Email" prepend-icon="email" outlined />

				<v-spacer></v-spacer>

				<v-select
					:items="roles"
					name="imageDomain"
					v-model="role"
					label="Role du modérateur"
					required
					:rules="[(v) => !!v || 'Champ requis']"
					outlined
				/>
			</v-card-actions>

			<v-card-actions>
				<v-btn
					id="gradient-outline"
					outlined
					class="ma-2 rounded-lg clickable"
					depressed
					v-on:click="revokeUsers"
				>
					<span style="font-family: 'Avenir Next Regular'">Révoquer tous les accès</span>
				</v-btn>

				<v-spacer></v-spacer>
				<v-btn id="gradient" class="ma-2 rounded-lg clickable" depressed v-on:click="addUserToModerator">
					<span style="font-family: 'Avenir Next Regular'">Ajouter l'utilisateur</span>
				</v-btn>
			</v-card-actions>
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
		}),

		methods: {
			addUserToModerator: async function() {
				//Get campaign to modify
				var addUserToModerator = this.$firebase.functions().httpsCallable("addUserToModerator")
				try {
					const result = await addUserToModerator({ email: this.email, role: this.role })
					console.log(result)
				} catch (error) {
					console.log(error)
				}
			},
			revokeUsers: async function() {
				//Get campaign to modify
				var revokeUsers = this.$firebase.functions().httpsCallable("revokeUsers")
				const result = await revokeUsers()

				console.log(result)
			},
		},
	}
</script>

<style></style>
