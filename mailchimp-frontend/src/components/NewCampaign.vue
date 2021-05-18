<template>
	<div>
		<Form v-bind:form.sync="this.form" v-on:submit="this.checkAuthentification"></Form>

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
	import Form from "./Form.vue"

	const tl = gsap.timeline({ defaults: { ease: "power1.out" } })

	export default {
		name: "NewForm",
		props: {
			msg: String,
		},
		components: {
			Form,
		},

		data: () => ({
			//Other variables
			overlayText: "Votre MRI s'envoie",
			loadingVisibility: true,

			backgroundColor: "background: white",

			// Name of the form data
			form: {},
		}),

		methods: {
			checkAuthentification: async function() {
				//is the user logged in ?
				if (this.isUserAuth) {
					this.sendForm()
				} else {
					await this.signInAction()
					this.sendForm()
				}
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

			...mapActions(["authAction", "signInAction", "signOutAction"]),
		},
		computed: {
			...mapGetters(["user", "moderator", "admin", "isUserAuth"]),
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
</style>
