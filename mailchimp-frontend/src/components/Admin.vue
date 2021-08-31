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
			class="text-wrap pt-3 pb-6 pl-4"
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
								item-text="role"
								item-value="abbr"
								name="role"
								v-model="role"
								label="Rôle"
								required
								:rules="[(v) => !!v || 'Champ requis']"
								outlined
							/>
						</v-col>
					</v-row>
				</v-container>

				<v-card-actions ma-0 pa-0>
					<v-tooltip bottom max-width="400" ma-0 pa-0>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								type="submit"
								form="adminForm"
								class="mx-auto mt-0 mb-5 white--text"
								:disabled="!isValid"
								color="green"
								depressed
								v-bind="attrs"
								v-on="on"
							>
								Ajouter le modérateur
							</v-btn>
						</template>
						<span>Le modérateur aura accès à la validation des MRI. Attention, ce nouveau modérateur ne pourra pas être supprimé individuellement : il faudra révoquer tous les accès pour pouvoir l'enlever.</span>
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

			<v-alert
				outlined
				text
				type="warning"
				class="mx-4 mt-5 mb-7"
			>
				À utiliser lors du changement de mandat <br />
				<p class="caption ma-0 pa-0">
					Lors de l'entrée en fonction du nouveau mandat de Telecom Etude, il faut révoquer tous les accès modérateur précédents avec le bouton ci-dessous.
					Une fois cela fait, il faut ajouter les nouveaux modérateurs (Responsable Commercial et Secrétaire Général) avec le formulaire ci-dessus.
					Cela permet de supprimer les accès de l'ancien mandat, et donc de limiter la modération au nouveau mandat.
				</p>
			</v-alert>

			<div class="text-center">
				<v-dialog width="500" v-model="dialogValidationBool">
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							class="mx-auto mb-7 white--text"
							color="red"
							depressed
							v-bind="attrs"
							v-on="on"
						>
							<span
								style="font-family: 'Avenir Next Regular';font-size: min(3vw, 13px);"
								>Révoquer tous les accès</span
							>
						</v-btn>
					</template>

					<v-card>
						<v-card-title class="text-h5">
							Confirmer la suppression
						</v-card-title>

						<v-card-text>
							Confirmez vous vouloir supprimer tous les accès aux fonctions de validation sur ce site ? Pour revenir en arrière, il faudra ajouter un par un chacune des adresses email @telecom-etude.fr des modérateurs dans la partie <i>Ajouter un modérateur</i>.
						</v-card-text>

						<v-divider></v-divider>

						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn
								color="grey"
								outlined
								depressed
								@click="dialogValidationBool = false"
							>
								Annuler
							</v-btn>
							<v-btn
								color="red"
								outlined
								depressed
								@click="revokeUsers"
							>
								Tout révoquer
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</div>

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

	</div>
</template>

<script>
	/**
	 * This page is only accessible by the admins (via the Vuex plugin). 
     * Here, an admin can grant the moderator role to a specific email adress or revoke the access to everyone.
     * This shold be done every year when the new team arrives.
     * @example [none]
	 */

	import gsap from "gsap"
	const tl = gsap.timeline({ defaults: { ease: "power1.out" } })

	export default {
		name: "Admin",

		data: () => ({
			email: "",
			roles: [
				{ role: "Responsable Commercial", abbr: "RespoCo" },
				{ role: "Secrétaire Général", abbr: "SecGez" },
			],

			role: "",

			isValid: false,

			emailRules: [
				(v) =>
					/^([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)@(telecom-etude\.fr)$/.test(v) || "Adresse prenom.nom@telecom-etude.fr uniquement",
			],

			//Other variables
			overlayText: "",
			loadingVisibility: true,
			dialogValidationBool: false,

			backgroundColor: "background: white",
		}),

		methods: {

			addUserToModerator: async function() {
				this.backgroundColor = "background: #e54540"
				this.overlayText = "Modérateur en cours d'ajout 📨"

				tl.fromTo(".intro", { y: "-100%" }, { y: "0%", duration: 0.75 })
				tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1 })

				var addUserToModerator = this.$firebase.functions().httpsCallable("addUserToModerator")
				var success = true
				try {
					const result = await addUserToModerator({ email: this.email, role: this.role })
					console.log(result)
				} catch (error) {
					console.log(error)
					success = false
				}
				//console.log("user added " + this.email + this.role)

				await tl.to(".text", {
					y: "-100%",
					duration: 1,
				})

				if (success) {
					this.loadingVisibility = false
					this.overlayText = "Modérateur ajouté ! ✅"
				} else {
					this.loadingVisibility = false
					this.overlayText = "Une erreur s'est produite ⚠️"
				}

				await tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1.5 })

				setTimeout(() => {
					//Set a timeout for the user to have time to read the message
					this.closeOverlay1(success)
				}, 1500)

			},

			revokeUsers: async function() {
				this.dialogValidationBool = false //close popup

				this.backgroundColor = "background: #e54540"
				this.overlayText = "Révocation des accès ❌"

				tl.fromTo(".intro", { y: "-100%" }, { y: "0%", duration: 0.75 })
				tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1 })

				var revokeUsers = this.$firebase.functions().httpsCallable("revokeUsers")
				var success = true
				try {
					const result = await revokeUsers()
					console.log(result)
				} catch (error) {
					console.log(error)
					success = false
				}
				//console.log("revoked")

				await tl.to(".text", {
					y: "-100%",
					duration: 1,
				})

				if (success) {
					this.loadingVisibility = false
					this.overlayText = "Accès supprimés ! ✅"
				} else {
					this.loadingVisibility = false
					this.overlayText = "Une erreur s'est produite ⚠️"
				}

				await tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1.5 })

				setTimeout(() => {
					//Set a timeout for the user to have time to read the message
					this.closeOverlay1(success)
				}, 1500)
				
				
			},

			closeOverlay1: async function(success) {
				tl.to(".text", { y: "-100%", duration: 1 })
				tl.to(".intro", { y: "100%", duration: 1 }, "-=0.5")

				if (success) {
					this.$refs.adminFormRef.reset()

				} else {
					//Add a hint message to help the user correct its mistakes
					console.log("here is what you need to do...")
				}
				setTimeout(() => {
					this.backgroundColor = "background: white"
					this.loadingVisibility = true
				}, 1500)
			},		},
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
