<template>
	<div>
		<template v-if="validation">
			<!-- Div shown when the page has been opened from the list of campaigns to be validated  -->
			<div>
			<v-card-title
				style="font-family: 'Avenir Next Regular'; justify-content: west;"
				class="text-wrap pt-10 pb-0"
			>
				<h1>VALIDATION</h1>
			</v-card-title>
			<v-card-title
				style="font-family: 'Avenir Next Regular'; justify-content: west;"
				class="text-wrap pt-0 pb-5 pl-4"
			>
				<h3>Modifier le MRI</h3>
			</v-card-title>
			</div>
		</template>
		<template v-else>
			<!-- Div when we open the page from the Mes MRI page  -->
			<v-card-title
				style="font-family: 'Avenir Next Regular'; justify-content: west;"
				class="text-wrap pt-10 pb-0"
			>
				<h1>MES MRI</h1>
			</v-card-title>
			<v-card-title
				style="font-family: 'Avenir Next Regular'; justify-content: west;"
				class="text-wrap pt-0 pb-5 pl-4"
			>
				<h3>Modifier mon MRI</h3>
			</v-card-title>
		</template>

		<v-expand-transition>
			<div v-if="campaignLoadingVisibility">
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

		<Form v-bind:form.sync="this.form" v-bind:campaignId="this.id" v-on:submit="this.checkAuthentification" v-if="!campaignLoadingVisibility"></Form>

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
	import Form from "../components/Form.vue"

	const tl = gsap.timeline({ defaults: { ease: "power1.out" } })

	export default {
		name: "MailForm",
		props: {
			validation: Boolean,
		},
		components: {
			Form,
		},

		data: () => ({
			id: "",
			form: {},

			//Other variables for the animation
			overlayText: "Votre MRI se mets a jour",
			loadingVisibility: true,
			backgroundColor: "background: white",
			campaignLoadingVisibility: true,
		}),

		async created() {
			this.id = this.$route.params.id
			var getCampaignWithId = this.$firebase.functions().httpsCallable("getCampaignWithId")
			var result = true
			try {
				result = await getCampaignWithId(this.id) //Call the firebase function
				console.log(result)
				this.campaignLoadingVisibility = false
			} catch (error) {
				console.log(error)
				this.campaignLoadingVisibility = false //better option ?
			}

			this.form = result.data
		},

		methods: {
			checkAuthentification: async function() {
				//is the user logged in ?
				if (this.isUserAuth) {
					this.updateCampaign()
				} else {
					await this.signInAction()
					this.updateCampaign()
				}
			},

			updateCampaign: async function() {
				//Animation
				this.backgroundColor = "background: #e54540"
				this.overlayText = "Votre MRI se met à jour 📨"

				tl.fromTo(".intro", { y: "-100%" }, { y: "0%", duration: 0.75 })
				tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1 })

				//Call to the api
				var data = this.form
				data.id = this.id

				const updateCampaign = this.$firebase.functions().httpsCallable("updateCampaign")
				const validateCampaign = this.$firebase.functions().httpsCallable("validateCampaign")
				var success = true
				try {
					await updateCampaign(data) //Call the firebase function
                    if (this.validation) {
                        await validateCampaign({ id: data.id })
                    }
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
					this.overlayText = "MRI mis à jour ! 🚀"
				} else {
					this.loadingVisibility = false
					this.overlayText = "Une erreur s'est produite ⚠️"
				}

				await tl.fromTo(".text", { y: "100%" }, { y: "0%", duration: 1.5 })

				setTimeout(() => {
					//Set a timeout for the user to have time to read the message
					this.closeOverlay(success)
				}, 1500)
				if (this.validation){
					this.$router.push({ path: `/validation` })
				}
				else{
					this.$router.push({ path: `/myCampaigns` })
				}
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

			...mapActions(["authAction", "signInAction", "signOutAction"]),
		},
		computed: {
			...mapGetters(["getUser", "isUserModerator", "isUserAdmin", "isUserAuth", "getDisplayName"]),
		},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	div {
		margin-bottom: 10px;
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
	.v-card__text, .v-card__title {
	word-break: normal; /* maybe !important  */
	}
</style>
