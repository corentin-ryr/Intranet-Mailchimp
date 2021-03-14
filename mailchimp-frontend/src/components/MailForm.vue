<template>
	<div>
		<v-card class="mx-auto mt-10" width="1000">
			<v-form
				id="mailForm"
				v-on:submit.prevent="sendForm"
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
					prepend-icon="create"
					outlined
				/>

				<v-textarea
					type="text"
					name="contentFirstDescription"
					v-model="form.contentFirstDescription"
					label="Description introductive"
					required
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
				/>

				<div class="text-center">
					<v-dialog height="90%" width="90%">
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="red lighten-2" dark v-bind="attrs" v-on="on" v-on:click="createPreviewHTML()">
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
					<v-btn type="submit" form="mailForm" class="mx-auto" :disabled="!isValid" color="secondary">
						Envoyer
					</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>

		<!-- HTML content for the loading animation -->
		<div class="intro">
			<div class="intro-text">
				<h1 class="hide">
					<span class="text" id="text">{{ overlayText }}</span>
				</h1>
			</div>
		</div>

		<div>
			<v-card class="mx-auto" width="400">
				<v-row align="center" justify="space-around" class="ma-10">
					<v-btn text class="d-flex align-center" href="https://github.com/corentin-ryr/Intranet-Mailchimp">
						Github
					</v-btn>
					<v-btn
						text
						class="d-flex align-center"
						href="https://www.linkedin.com/in/corentin-royer-a67a90159/"
					>
						Corentin
					</v-btn>
					<v-btn text class="d-flex align-center" href="https://www.linkedin.com/in/hugo-queinnec/">
						Hugo
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
				"Traitement d'Image",
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
			sendForm: async function() {
				console.log(this.form)

				this.overlayText = "Votre MRI s'envoie"
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

			createPreviewHTML: function() {
				const [
					imageDomainLink,
					imagePayLink,
					imageDifficultyLink,
					contentApply,
					contentMailContact,
					contentMailTo,
				] = this.contentTransformations(
					this.form.imageDomain,
					this.form.imagePay,
					this.form.imageDifficulty,
					this.form.formBoolean,
					this.form.formLink,
					this.form.contactList
				)
				this.previewHTML = this.contentEditHTML(
					this.form.contentTitle,
					this.form.contentFirstDescription,
					this.form.contentDomain,
					imageDomainLink,
					this.form.contentPay,
					imagePayLink,
					this.form.contentDifficulty,
					imageDifficultyLink,
					this.form.contentSkills,
					this.form.contentSchedule,
					this.form.contentDescription,
					contentApply,
					contentMailContact,
					contentMailTo
				)
			},

			contentTransformations: function(
				imageDomain,
				imagePay,
				imageDifficulty,
				formBoolean,
				formLink,
				contactList
			) {
				var imageDomainLink = ""
				var imagePayLink = ""
				var imageDifficultyLink = ""
				var contentApply = ""
				var contentMailContact = ""
				var contentMailTo = ""

				switch (imageDomain) {
					case "data":
						imageDomainLink =
							"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/3f084638-6053-45c6-a99e-7ad481f340fc.png"
						break
					case "dev":
						imageDomainLink =
							"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/458e3a19-7fe7-4471-aad4-8d19e43f2383.png"
						break
					case "cyber":
						imageDomainLink =
							"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/3f084638-6053-45c6-a99e-7ad481f340fc.png"
						break
					case "se":
						imageDomainLink =
							"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/ad81493a-5281-4772-adef-4bcebee00243.png"
						break
					case "image":
						imageDomainLink =
							"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/863635c4-6fc0-42d0-add6-7c4b8aa04b9b.png"
						break
					case "etude":
						imageDomainLink =
							"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/0104e278-2e89-44d0-823f-86e2e92a1e70.png"
						break
					default:
						break
				}

				switch (imagePay) {
					case "low":
						imagePayLink =
							"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/aa0aa2c2-9aaf-46f8-ae91-8c28953b02bc.png"
						break
					case "middle":
						imagePayLink =
							"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/d790eeff-772d-4aa7-91a0-f1883414b675.png"
						break
					case "high":
						imagePayLink =
							"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/7781ba0c-a348-4722-ba77-beee6bbb5f51.png"
						break
					default:
						break
				}

				switch (imageDifficulty) {
					case "low":
						imageDifficultyLink =
							"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/b30e558d-f0e5-489a-80ba-681d27021c0a.png"
						break
					case "middle":
						imageDifficultyLink =
							"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/1f020378-3a07-4a5b-892c-62fd7822e9f0.png"
						break
					case "high":
						imageDifficultyLink =
							"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/93539be4-2afc-4c5f-a34e-f09fa0daa6b1.png"
						break
					default:
						break
				}

				if (formBoolean) {
					contentApply =
						`
					</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
						<tbody class="mcnTextBlockOuter">
							<tr>
								<td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
									<!--[if mso]>
									<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
									<tr>
									<![endif]-->

									<!--[if mso]>
									<td valign="top" width="600" style="width:600px;">
									<![endif]-->
									<table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
										<tbody><tr>

											<td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

												Si vous souhaitez postuler, <strong>remplissez ce formulaire </strong>et<strong> envoyez nous votre CV par mail&nbsp;</strong>en cliquant sur les boutons ci-dessous.<br>
					&nbsp;
											</td>
										</tr>
									</tbody></table>
									<!--[if mso]>
									</td>
									<![endif]-->

									<!--[if mso]>
									</tr>
									</table>
									<![endif]-->
								</td>
							</tr>
						</tbody>
					</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
						<tbody class="mcnButtonBlockOuter">
							<tr>
								<td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
									<table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-top-left-radius: 3px;border-top-right-radius: 3px;border-bottom-right-radius: 3px;border-bottom-left-radius: 3px;background-color: #E54540;">
										<tbody>
											<tr>
												<td align="center" valign="middle" class="mcnButtonContent" style="font-family: Helvetica; font-size: 18px; padding: 18px;">
													<a class="mcnButton " title="Je répond au formulaire" href="` +
						formLink +
						`" target="_blank" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Je répond au formulaire</a>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					`
				} else {
					contentApply = `
					</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
						<tbody class="mcnTextBlockOuter">
							<tr>
								<td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
									<!--[if mso]>
									<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
									<tr>
									<![endif]-->

									<!--[if mso]>
									<td valign="top" width="600" style="width:600px;">
									<![endif]-->
									<table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
										<tbody><tr>

											<td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

												Si vous souhaitez postuler, <strong> dites nous brièvement pourquoi et envoyez nous votre CV par mail&nbsp;</strong>en cliquant sur le bouton ci-dessous.<br>
					&nbsp;
											</td>
										</tr>
									</tbody></table>
									<!--[if mso]>
						Create			</td>
									<![endif]-->

									<!--[if mso]>
									</tr>
									</table>
									<![endif]-->
								</td>
							</tr>
						</tbody>
					`
				}

				contentMailTo = "mailto:"
				for (var i1 = 0; i1 < contactList.length; i1++) {
					var mail0 = contactList[i1]
					contentMailTo += mail0 + ","
				}
				contentMailTo += "?subject=Envoi%20du%20CV%20pour%20l'%C3%A9tude%20"

				contentMailContact = "N'hésitez pas à demander plus d'informations ou de détails à "
				for (var i2 = 0; i2 < contactList.length; i2++) {
					var mail = contactList[i2]
					var name = mail.charAt(0).toUpperCase() + mail.substring(1, mail.indexOf("."))
					if (contactList.length == 1) {
						contentMailContact += name + " (" + mail + ")."
					} else if (i2 != contactList.length - 1) {
						contentMailContact += name + " (" + mail + "), "
					} else {
						contentMailContact += "et " + name + " (" + mail + ")."
					}
				}

				return [
					imageDomainLink,
					imagePayLink,
					imageDifficultyLink,
					contentApply,
					contentMailContact,
					contentMailTo,
				]
			},

			contentEditHTML: function(
				contentTitle,
				contentFirstDescription,
				contentDomain,
				imageDomainLink,
				contentPay,
				imagePayLink,
				contentDifficulty,
				imageDifficultyLink,
				contentSkills,
				contentSchedule,
				contentDescription,
				contentApply,
				contentMailContact,
				contentMailTo
			) {
				var htmlContent =
					`
					<!doctype html>
					<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
						<head>
							<!-- NAME: SELL PRODUCTS -->
							<!--[if gte mso 15]>
							<xml>
								<o:OfficeDocumentSettings>
								<o:AllowPNG/>
								<o:PixelsPerInch>96</o:PixelsPerInch>
								</o:OfficeDocumentSettings>
							</xml>
							<![endif]-->
							<meta charset="UTF-8">
							<meta http-equiv="X-UA-Compatible" content="IE=edge">
							<meta name="viewport" content="width=device-width, initial-scale=1">
							<title>*|MC:SUBJECT|*</title>

						<style type="text/css">
							p{
								margin:10px 0;
								padding:0;
							}
							table{
								border-collapse:collapse;
							}
							h1,h2,h3,h4,h5,h6{
								display:block;
								margin:0;
								padding:0;
							}
							img,a img{
								border:0;
								height:auto;
								outline:none;
								text-decoration:none;
							}
							body,#bodyTable,#bodyCell{
								height:100%;
								margin:0;
								padding:0;
								width:100%;
							}
							.mcnPreviewText{
								display:none !important;
							}
							#outlook a{
								padding:0;
							}
							img{
								-ms-interpolation-mode:bicubic;
							}
							table{
								mso-table-lspace:0pt;
								mso-table-rspace:0pt;
							}
							.ReadMsgBody{
								width:100%;
							}
							.ExternalClass{
								width:100%;
							}
							p,a,li,td,blockquote{
								mso-line-height-rule:exactly;
							}
							a[href^=tel],a[href^=sms]{
								color:inherit;
								cursor:default;
								text-decoration:none;
							}
							p,a,li,td,body,table,blockquote{
								-ms-text-size-adjust:100%;
								-webkit-text-size-adjust:100%;
							}
							.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{
								line-height:100%;
							}
							a[x-apple-data-detectors]{
								color:inherit !important;
								text-decoration:none !important;
								font-size:inherit !important;
								font-family:inherit !important;
								font-weight:inherit !important;
								line-height:inherit !important;
							}
							.templateContainer{
								max-width:600px !important;
							}
							a.mcnButton{
								display:block;
							}
							.mcnImage,.mcnRetinaImage{
								vertical-align:bottom;
							}
							.mcnTextContent{
								word-break:break-word;
							}
							.mcnTextContent img{
								height:auto !important;
							}
							.mcnDividerBlock{
								table-layout:fixed !important;
							}
						/*
						@tab Page
						@section Heading 1
						@style heading 1
						*/
							h1{
								/*@editable*/color:#222222;
								/*@editable*/font-family:Helvetica;
								/*@editable*/font-size:30px;
								/*@editable*/font-style:normal;
								/*@editable*/font-weight:bold;
								/*@editable*/line-height:150%;
								/*@editable*/letter-spacing:normal;
								/*@editable*/text-align:center;
							}
						/*
						@tab Page
						@section Heading 2
						@style heading 2
						*/
							h2{
								/*@editable*/color:#222222;
								/*@editable*/font-family:Helvetica;
								/*@editable*/font-size:34px;
								/*@editable*/font-style:normal;
								/*@editable*/font-weight:bold;
								/*@editable*/line-height:150%;
								/*@editable*/letter-spacing:normal;
								/*@editable*/text-align:left;
							}
						/*
						@tab Page
						@section Heading 3
						@style heading 3
						*/
							h3{
								/*@editable*/color:#444444;
								/*@editable*/font-family:Helvetica;
								/*@editable*/font-size:22px;
								/*@editable*/font-style:normal;
								/*@editable*/font-weight:bold;
								/*@editable*/line-height:150%;
								/*@editable*/letter-spacing:normal;
								/*@editable*/text-align:left;
							}
						/*
						@tab Page
						@section Heading 4
						@style heading 4
						*/
							h4{
								/*@editable*/color:#444444;
								/*@editable*/font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;
								/*@editable*/font-size:16px;
								/*@editable*/font-style:normal;
								/*@editable*/font-weight:bold;
								/*@editable*/line-height:125%;
								/*@editable*/letter-spacing:normal;
								/*@editable*/text-align:left;
							}
						/*
						@tab Header
						@section Header Container Style
						*/
							#templateHeader{
								/*@editable*/background-color:#F7F7F7;
								/*@editable*/background-image:none;
								/*@editable*/background-repeat:no-repeat;
								/*@editable*/background-position:center;
								/*@editable*/background-size:cover;
								/*@editable*/border-top:0;
								/*@editable*/border-bottom:0;
								/*@editable*/padding-top:16px;
								/*@editable*/padding-bottom:16px;
							}
						/*
						@tab Header
						@section Header Interior Style
						*/
							.headerContainer{
								/*@editable*/background-color:transparent;
								/*@editable*/background-image:none;
								/*@editable*/background-repeat:no-repeat;
								/*@editable*/background-position:center;
								/*@editable*/background-size:cover;
								/*@editable*/border-top:0;
								/*@editable*/border-bottom:0;
								/*@editable*/padding-top:0;
								/*@editable*/padding-bottom:0;
							}
						/*
						@tab Header
						@section Header Text
						*/
							.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
								/*@editable*/color:#757575;
								/*@editable*/font-family:Helvetica;
								/*@editable*/font-size:16px;
								/*@editable*/line-height:150%;
								/*@editable*/text-align:left;
							}
						/*
						@tab Header
						@section Header Link
						*/
							.headerContainer .mcnTextContent a,.headerContainer .mcnTextContent p a{
								/*@editable*/color:#007C89;
								/*@editable*/font-weight:normal;
								/*@editable*/text-decoration:underline;
							}
						/*
						@tab Body
						@section Body Container Style
						*/
							#templateBody{
								/*@editable*/background-color:#ffffff;
								/*@editable*/background-image:none;
								/*@editable*/background-repeat:no-repeat;
								/*@editable*/background-position:center;
								/*@editable*/background-size:cover;
								/*@editable*/border-top:0;
								/*@editable*/border-bottom:0;
								/*@editable*/padding-top:0px;
								/*@editable*/padding-bottom:0px;
							}
						/*
						@tab Body
						@section Body Interior Style
						*/
							.bodyContainer{
								/*@editable*/background-color:#transparent;
								/*@editable*/background-image:none;
								/*@editable*/background-repeat:no-repeat;
								/*@editable*/background-position:center;
								/*@editable*/background-size:cover;
								/*@editable*/border-top:0;
								/*@editable*/border-bottom:0;
								/*@editable*/padding-top:0;
								/*@editable*/padding-bottom:0;
							}
						/*
						@tab Body
						@section Body Text
						*/
							.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
								/*@editable*/color:#757575;
								/*@editable*/font-family:Helvetica;
								/*@editable*/font-size:16px;
								/*@editable*/line-height:150%;
								/*@editable*/text-align:left;
							}
						/*
						@tab Body
						@section Body Link
						*/
							.bodyContainer .mcnTextContent a,.bodyContainer .mcnTextContent p a{
								/*@editable*/color:#007C89;
								/*@editable*/font-weight:normal;
								/*@editable*/text-decoration:underline;
							}
						/*
						@tab Footer
						@section Footer Style
						*/
							#templateFooter{
								/*@editable*/background-color:#333333;
								/*@editable*/background-image:none;
								/*@editable*/background-repeat:no-repeat;
								/*@editable*/background-position:center;
								/*@editable*/background-size:cover;
								/*@editable*/border-top:0;
								/*@editable*/border-bottom:0;
								/*@editable*/padding-top:0px;
								/*@editable*/padding-bottom:0px;
							}
						/*
						@tab Footer
						@section Footer Interior Style
						*/
							.footerContainer{
								/*@editable*/background-color:transparent;
								/*@editable*/background-image:none;
								/*@editable*/background-repeat:no-repeat;
								/*@editable*/background-position:center;
								/*@editable*/background-size:cover;
								/*@editable*/border-top:0;
								/*@editable*/border-bottom:0;
								/*@editable*/padding-top:0;
								/*@editable*/padding-bottom:0;
							}
						/*
						@tab Footer
						@section Footer Text
						*/
							.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
								/*@editable*/color:#FFFFFF;
								/*@editable*/font-family:Helvetica;
								/*@editable*/font-size:12px;
								/*@editable*/line-height:150%;
								/*@editable*/text-align:center;
							}
						/*
						@tab Footer
						@section Footer Link
						*/
							.footerContainer .mcnTextContent a,.footerContainer .mcnTextContent p a{
								/*@editable*/color:#FFFFFF;
								/*@editable*/font-weight:normal;
								/*@editable*/text-decoration:underline;
							}
						@media only screen and (min-width:768px){
							.templateContainer{
								width:600px !important;
							}

					}	@media only screen and (max-width: 410px){
							body,table,td,p,a,li,blockquote{
								-webkit-text-size-adjust:none !important;
							}

					}	@media only screen and (max-width: 410px){
							body{
								width:100% !important;
								min-width:100% !important;
							}

					}	@media only screen and (max-width: 410px){
							.mcnRetinaImage{
								max-width:100% !important;
							}

					}	@media only screen and (max-width: 410px){
							.mcnImage{
								width:100% !important;
							}

					}	@media only screen and (max-width: 410px){
							.mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{
								max-width:100% !important;
								width:100% !important;
							}

					}	@media only screen and (max-width: 410px){
							.mcnBoxedTextContentContainer{
								min-width:100% !important;
							}

					}	@media only screen and (max-width: 410px){
							.mcnImageGroupContent{
								padding:9px !important;
							}

					}	@media only screen and (max-width: 410px){
							.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{
								padding-top:9px !important;
							}

					}	@media only screen and (max-width: 410px){
							.mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{
								padding-top:18px !important;
							}

					}	@media only screen and (max-width: 410px){
							.mcnImageCardBottomImageContent{
								padding-bottom:9px !important;
							}

					}	@media only screen and (max-width: 410px){
							.mcnImageGroupBlockInner{
								padding-top:0 !important;
								padding-bottom:0 !important;
							}

					}	@media only screen and (max-width: 410px){
							.mcnImageGroupBlockOuter{
								padding-top:9px !important;
								padding-bottom:9px !important;
							}

					}	@media only screen and (max-width: 410px){
							.mcnTextContent,.mcnBoxedTextContentColumn{
								padding-right:18px !important;
								padding-left:18px !important;
							}

					}	@media only screen and (max-width: 410px){
							.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{
								padding-right:18px !important;
								padding-bottom:0 !important;
								padding-left:18px !important;
							}

					}	@media only screen and (max-width: 410px){
							.mcpreview-image-uploader{
								display:none !important;
								width:100% !important;
							}

					}	@media only screen and (max-width: 410px){
						/*
						@tab Mobile Styles
						@section Heading 1
						@tip Make the first-level headings larger in size for better readability on small screens.
						*/
							h1{
								/*@editable*/font-size:30px !important;
								/*@editable*/line-height:125% !important;
							}

					}	@media only screen and (max-width: 410px){
						/*
						@tab Mobile Styles
						@section Heading 2
						@tip Make the second-level headings larger in size for better readability on small screens.
						*/
							h2{
								/*@editable*/font-size:26px !important;
								/*@editable*/line-height:125% !important;
							}

					}	@media only screen and (max-width: 410px){
						/*
						@tab Mobile Styles
						@section Heading 3
						@tip Make the third-level headings larger in size for better readability on small screens.
						*/
							h3{
								/*@editable*/font-size:20px !important;
								/*@editable*/line-height:150% !important;
							}

					}	@media only screen and (max-width: 410px){
						/*
						@tab Mobile Styles
						@section Heading 4
						@tip Make the fourth-level headings larger in size for better readability on small screens.
						*/
							h4{
								/*@editable*/font-size:18px !important;
								/*@editable*/line-height:120% !important;
							}

					}	@media only screen and (max-width: 410px){
						/*
						@tab Mobile Styles
						@section Boxed Text
						@tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
						*/
							.mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{
								/*@editable*/font-size:14px !important;
								/*@editable*/line-height:150% !important;
							}

					}	@media only screen and (max-width: 410px){
						/*
						@tab Mobile Styles
						@section Header Text
						@tip Make the header text larger in size for better readability on small screens.
						*/
							.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
								/*@editable*/font-size:16px !important;
								/*@editable*/line-height:150% !important;
							}

					}	@media only screen and (max-width: 410px){
						/*
						@tab Mobile Styles
						@section Body Text
						@tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
						*/
							.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
								/*@editable*/font-size:16px !important;
								/*@editable*/line-height:150% !important;
							}

					}	@media only screen and (max-width: 410px){
						/*
						@tab Mobile Styles
						@section Footer Text
						@tip Make the footer content text larger in size for better readability on small screens.
						*/
							.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
								/*@editable*/font-size:14px !important;
								/*@editable*/line-height:150% !important;
							}

					}</style></head>
						<body>
							<!--*|IF:MC_PREVIEW_TEXT|*-->
							<!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span><!--<![endif]-->
							<!--*|END:IF|*-->
							<center>
								<table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
									<tr>
										<td align="center" valign="top" id="bodyCell">
											<!-- BEGIN TEMPLATE // -->
											<table border="0" cellpadding="0" cellspacing="0" width="100%">
												<tr>
													<td align="center" valign="top" id="templateHeader" data-template-container>
														<!--[if (gte mso 9)|(IE)]>
														<table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
														<tr>
														<td align="center" valign="top" width="600" style="width:600px;">
														<![endif]-->
														<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
															<tr>
																<td valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;">
						<tbody class="mcnImageBlockOuter">
								<tr>
									<td valign="top" style="padding:9px" class="mcnImageBlockInner">
										<table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;">
											<tbody><tr>
												<td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">


															<img align="center" alt="Logo Telecom Etude" src="https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/61b22c4c-f592-4749-9a66-7978b8806deb.png" width="130" style="max-width:130px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage">


												</td>
											</tr>
										</tbody></table>
									</td>
								</tr>
						</tbody>
					</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
						<tbody class="mcnTextBlockOuter">
							<tr>
								<td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
									<!--[if mso]>
									<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
									<tr>
									<![endif]-->

									<!--[if mso]>
									<td valign="top" width="600" style="width:600px;">
									<![endif]-->
									<table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
										<tbody><tr>

											<td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

												<h1>` +
					contentTitle +
					`</h1>

					<div id="gtx-trans" style="position: absolute; left: -41px; top: -8px;">
					<div class="gtx-trans-icon">&nbsp;</div>
					</div>

											</td>
										</tr>
									</tbody></table>
									<!--[if mso]>
									</td>
									<![endif]-->

									<!--[if mso]>
									</tr>
									</table>
									<![endif]-->
								</td>
							</tr>
						</tbody>
					</table></td>
															</tr>
														</table>
														<!--[if (gte mso 9)|(IE)]>
														</td>
														</tr>
														</table>
														<![endif]-->
													</td>
												</tr>
												<tr>
													<td align="center" valign="top" id="templateBody" data-template-container>
														<!--[if (gte mso 9)|(IE)]>
														<table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
														<tr>
														<td align="center" valign="top" width="600" style="width:600px;">
														<![endif]-->
														<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
															<tr>
																<td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
						<tbody class="mcnTextBlockOuter">
							<tr>
								<td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
									<!--[if mso]>
									<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
									<tr>
									<![endif]-->

									<!--[if mso]>
									<td valign="top" width="600" style="width:600px;">
									<![endif]-->
									<table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
										<tbody><tr>

											<td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

												<br>
					Bonjour à toutes et à tous,<br>
					<br>
					` +
					contentFirstDescription +
					`
											</td>
										</tr>
									</tbody></table>
									<!--[if mso]>
									</td>
									<![endif]-->

									<!--[if mso]>
									</tr>
									</table>
									<![endif]-->
								</td>
							</tr>
						</tbody>
					</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnCaptionBlock">
						<tbody class="mcnCaptionBlockOuter">
							<tr>
								<td class="mcnCaptionBlockInner" valign="top" style="padding:9px;">


					<table align="left" border="0" cellpadding="0" cellspacing="0" class="mcnCaptionBottomContent" width="33%">
						<tbody><tr>
							<td class="mcnCaptionBottomImageContent" align="center" valign="top" style="padding:0 9px 9px 9px;">



								<img alt="Domaine" src="` +
					imageDomainLink +
					`" width="100%" style="max-width: 250px; border-top-left-radius: 0%; border-top-right-radius: 0%; border-bottom-right-radius: 0%; border-bottom-left-radius: 0%;" class="mcnImage">


							</td>
						</tr>
						<tr>
							<td class="mcnTextContent" valign="top" style="padding:0 9px 0 9px;" width="100%">
								<h4 class="null" style="text-align: center; font-size: smaller; font-weight: lighter; color: #757575;">DOMAINE</h4>
								<h4 class="null" style="text-align: center;">` +
					contentDomain +
					`</h4>

							</td>
						</tr>
					</tbody></table>

					<table align="left" border="0" cellpadding="0" cellspacing="0" class="mcnCaptionBottomContent" width="33%">
						<tbody><tr>
							<td class="mcnCaptionBottomImageContent" align="center" valign="top" style="padding:0 9px 9px 9px;">



								<img alt="Rémunération" src="` +
					imagePayLink +
					`" width="100%" style="max-width: 250px; border-top-left-radius: 0%; border-top-right-radius: 0%; border-bottom-right-radius: 0%; border-bottom-left-radius: 0%;" class="mcnImage">


							</td>
						</tr>
						<tr>
							<td class="mcnTextContent" valign="top" style="padding:0 9px 0 9px;" width="100%">
								<h4 class="null" style="text-align: center; font-size: smaller; font-weight: lighter; color: #757575;">RÉMUNÉRATION</h4>
								<h4 class="null" style="text-align: center;">` +
					contentPay +
					`</h4>

							</td>
						</tr>
					</tbody></table>

					<table align="left" border="0" cellpadding="0" cellspacing="0" class="mcnCaptionBottomContent" width="33%">
						<tbody><tr>
							<td class="mcnCaptionBottomImageContent" align="center" valign="top" style="padding:0 9px 9px 9px;">



								<img alt="Difficulté" src="` +
					imageDifficultyLink +
					`" width="100%" style="max-width: 250px; border-top-left-radius: 0%; border-top-right-radius: 0%; border-bottom-right-radius: 0%; border-bottom-left-radius: 0%;" class="mcnImage">


							</td>
						</tr>
						<tr>
							<td class="mcnTextContent" valign="top" style="padding:0 9px 0 9px;" width="100%">
								<h4 class="null" style="text-align: center; font-size: smaller; font-weight: lighter; color: #757575;">DIFFICULTÉ</h4>
								<h4 class="null" style="text-align: center;">` +
					contentDifficulty +
					`</h4>

							</td>
						</tr>
					</tbody></table>



					</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
						<tbody class="mcnDividerBlockOuter">
							<tr>
								<td class="mcnDividerBlockInner" style="min-width: 100%; padding: 18px;">
									<table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top-width: 2px;border-top-style: solid;border-top-color: #EAEAEA;">
										<tbody><tr>
											<td>
												<span></span>
											</td>
										</tr>
									</tbody></table>
					<!--
									<td class="mcnDividerBlockInner" style="padding: 18px;">
									<hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
					-->
								</td>
							</tr>
						</tbody>
					</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
						<tbody class="mcnTextBlockOuter">
							<tr>
								<td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
									<!--[if mso]>
									<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
									<tr>
									<![endif]-->

									<!--[if mso]>
									<td valign="top" width="600" style="width:600px;">
									<![endif]-->
									<table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
										<tbody><tr>

											<td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px; font-family: Arial, &quot;Helvetica Neue&quot;, Helvetica, sans-serif;">

												<h3>Compétences :</h3>
					` +
					contentSkills +
					`
											</td>
										</tr>
									</tbody></table>
									<!--[if mso]>
									</td>
									<![endif]-->

									<!--[if mso]>
									</tr>
									</table>
									<![endif]-->
								</td>
							</tr>
						</tbody>
					</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
						<tbody class="mcnTextBlockOuter">
							<tr>
								<td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
									<!--[if mso]>
									<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
									<tr>
									<![endif]-->

									<!--[if mso]>
									<td valign="top" width="600" style="width:600px;">
									<![endif]-->
									<table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
										<tbody><tr>

											<td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px; font-family: Arial, &quot;Helvetica Neue&quot;, Helvetica, sans-serif;">

												<h3>Échéances :</h3>
					` +
					contentSchedule +
					`
											</td>
										</tr>
									</tbody></table>
									<!--[if mso]>
									</td>
									<![endif]-->

									<!--[if mso]>
									</tr>
									</table>
									<![endif]-->
								</td>
							</tr>
						</tbody>
					</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
						<tbody class="mcnTextBlockOuter">
							<tr>
								<td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
									<!--[if mso]>
									<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
									<tr>
									<![endif]-->

									<!--[if mso]>
									<td valign="top" width="600" style="width:600px;">
									<![endif]-->
									<table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
										<tbody><tr>

											<td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px; font-family: Arial, &quot;Helvetica Neue&quot;, Helvetica, sans-serif;">

												<h3>Description :</h3>
					` +
					contentDescription +
					`
											</td>
										</tr>
									</tbody></table>
									<!--[if mso]>
									</td>
									<![endif]-->

									<!--[if mso]>
									</tr>
									</table>
									<![endif]-->
								</td>
							</tr>
						</tbody>
					</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
						<tbody class="mcnDividerBlockOuter">
							<tr>
								<td class="mcnDividerBlockInner" style="min-width: 100%; padding: 18px;">
									<table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top-width: 2px;border-top-style: solid;border-top-color: #EAEAEA;">
										<tbody><tr>
											<td>
												<span></span>
											</td>
										</tr>
									</tbody></table>
					<!--
									<td class="mcnDividerBlockInner" style="padding: 18px;">
									<hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
					-->
								</td>
							</tr>
						</tbody>
					` +
					contentApply +
					`
					</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
						<tbody class="mcnButtonBlockOuter">
							<tr>
								<td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
									<table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-top-left-radius: 4px;border-top-right-radius: 4px;border-bottom-right-radius: 4px;border-bottom-left-radius: 4px;background-color: #E54540;">
										<tbody>
											<tr>
												<td align="center" valign="middle" class="mcnButtonContent" style="font-family: Arial; font-size: 18px; padding: 18px;">
													<a class="mcnButton " title="J'envoie mon CV" href="` +
					contentMailTo +
					`" target="_blank" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">J'envoie mon CV</a>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
						<tbody class="mcnTextBlockOuter">
							<tr>
								<td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
									<!--[if mso]>
									<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
									<tr>
									<![endif]-->

									<!--[if mso]>
									<td valign="top" width="600" style="width:600px;">
									<![endif]-->
									<table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
										<tbody><tr>

											<td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

												` +
					contentMailContact +
					`<br>
					<br>
					À bientôt,<br>
					L'équipe Telecom Etude
											</td>
										</tr>
									</tbody></table>
									<!--[if mso]>
									</td>
									<![endif]-->

									<!--[if mso]>
									</tr>
									</table>
									<![endif]-->
								</td>
							</tr>
						</tbody>
					</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowBlock" style="min-width:100%;">
						<tbody class="mcnFollowBlockOuter">
							<tr>
								<td align="center" valign="top" style="padding:9px" class="mcnFollowBlockInner">
									<table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentContainer" style="min-width:100%;">
						<tbody><tr>
							<td align="center" style="padding-left:9px;padding-right:9px;">
								<table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;" class="mcnFollowContent">
									<tbody><tr>
										<td align="center" valign="top" style="padding-top:9px; padding-right:9px; padding-left:9px;">
											<table align="center" border="0" cellpadding="0" cellspacing="0">
												<tbody><tr>
													<td align="center" valign="top">
														<!--[if mso]>
														<table align="center" border="0" cellspacing="0" cellpadding="0">
														<tr>
														<![endif]-->

															<!--[if mso]>
															<td align="center" valign="top">
															<![endif]-->


																<table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;">
																	<tbody><tr>
																		<td valign="top" style="padding-right:10px; padding-bottom:9px;" class="mcnFollowContentItemContainer">
																			<table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem">
																				<tbody><tr>
																					<td align="left" valign="middle" style="padding-top:5px; padding-right:10px; padding-bottom:5px; padding-left:9px;">
																						<table align="left" border="0" cellpadding="0" cellspacing="0" width="">
																							<tbody><tr>

																									<td align="center" valign="middle" width="24" class="mcnFollowIconContent">
																										<a href="https://www.linkedin.com/company/telecom-etude/" target="_blank"><img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-linkedin-48.png" alt="LinkedIn" style="display:block;" height="24" width="24" class=""></a>
																									</td>


																							</tr>
																						</tbody></table>
																					</td>
																				</tr>
																			</tbody></table>
																		</td>
																	</tr>
																</tbody></table>

															<!--[if mso]>
															</td>
															<![endif]-->

															<!--[if mso]>
															<td align="center" valign="top">
															<![endif]-->


																<table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;">
																	<tbody><tr>
																		<td valign="top" style="padding-right:10px; padding-bottom:9px;" class="mcnFollowContentItemContainer">
																			<table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem">
																				<tbody><tr>
																					<td align="left" valign="middle" style="padding-top:5px; padding-right:10px; padding-bottom:5px; padding-left:9px;">
																						<table align="left" border="0" cellpadding="0" cellspacing="0" width="">
																							<tbody><tr>

																									<td align="center" valign="middle" width="24" class="mcnFollowIconContent">
																										<a href="https://www.facebook.com/TelecomEtude" target="_blank"><img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-facebook-48.png" alt="Facebook" style="display:block;" height="24" width="24" class=""></a>
																									</td>


																							</tr>
																						</tbody></table>
																					</td>
																				</tr>
																			</tbody></table>
																		</td>
																	</tr>
																</tbody></table>

															<!--[if mso]>
															</td>
															<![endif]-->

															<!--[if mso]>
															<td align="center" valign="top">
															<![endif]-->


																<table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;">
																	<tbody><tr>
																		<td valign="top" style="padding-right:10px; padding-bottom:9px;" class="mcnFollowContentItemContainer">
																			<table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem">
																				<tbody><tr>
																					<td align="left" valign="middle" style="padding-top:5px; padding-right:10px; padding-bottom:5px; padding-left:9px;">
																						<table align="left" border="0" cellpadding="0" cellspacing="0" width="">
																							<tbody><tr>

																									<td align="center" valign="middle" width="24" class="mcnFollowIconContent">
																										<a href="https://www.instagram.com/telecometude/" target="_blank"><img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-instagram-48.png" alt="Instagram" style="display:block;" height="24" width="24" class=""></a>
																									</td>


																							</tr>
																						</tbody></table>
																					</td>
																				</tr>
																			</tbody></table>
																		</td>
																	</tr>
																</tbody></table>

															<!--[if mso]>
															</td>
															<![endif]-->

															<!--[if mso]>
															<td align="center" valign="top">
															<![endif]-->


																<table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;">
																	<tbody><tr>
																		<td valign="top" style="padding-right:10px; padding-bottom:9px;" class="mcnFollowContentItemContainer">
																			<table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem">
																				<tbody><tr>
																					<td align="left" valign="middle" style="padding-top:5px; padding-right:10px; padding-bottom:5px; padding-left:9px;">
																						<table align="left" border="0" cellpadding="0" cellspacing="0" width="">
																							<tbody><tr>

																									<td align="center" valign="middle" width="24" class="mcnFollowIconContent">
																										<a href="https://twitter.com/TelecomEtude" target="_blank"><img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-twitter-48.png" alt="Twitter" style="display:block;" height="24" width="24" class=""></a>
																									</td>


																							</tr>
																						</tbody></table>
																					</td>
																				</tr>
																			</tbody></table>
																		</td>
																	</tr>
																</tbody></table>

															<!--[if mso]>
															</td>
															<![endif]-->

															<!--[if mso]>
															<td align="center" valign="top">
															<![endif]-->


																<table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;">
																	<tbody><tr>
																		<td valign="top" style="padding-right:10px; padding-bottom:9px;" class="mcnFollowContentItemContainer">
																			<table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem">
																				<tbody><tr>
																					<td align="left" valign="middle" style="padding-top:5px; padding-right:10px; padding-bottom:5px; padding-left:9px;">
																						<table align="left" border="0" cellpadding="0" cellspacing="0" width="">
																							<tbody><tr>

																									<td align="center" valign="middle" width="24" class="mcnFollowIconContent">
																										<a href="https://www.telecom-etude.fr" target="_blank"><img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-link-48.png" alt="Website" style="display:block;" height="24" width="24" class=""></a>
																									</td>


																							</tr>
																						</tbody></table>
																					</td>
																				</tr>
																			</tbody></table>
																		</td>
																	</tr>
																</tbody></table>

															<!--[if mso]>
															</td>
															<![endif]-->

															<!--[if mso]>
															<td align="center" valign="top">
															<![endif]-->


																<table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;">
																	<tbody><tr>
																		<td valign="top" style="padding-right:0; padding-bottom:9px;" class="mcnFollowContentItemContainer">
																			<table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem">
																				<tbody><tr>
																					<td align="left" valign="middle" style="padding-top:5px; padding-right:10px; padding-bottom:5px; padding-left:9px;">
																						<table align="left" border="0" cellpadding="0" cellspacing="0" width="">
																							<tbody><tr>

																									<td align="center" valign="middle" width="24" class="mcnFollowIconContent">
																										<a href="mailto:contact@telecom-etude.fr" target="_blank"><img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-forwardtofriend-48.png" alt="Email" style="display:block;" height="24" width="24" class=""></a>
																									</td>


																							</tr>
																						</tbody></table>
																					</td>
																				</tr>
																			</tbody></table>
																		</td>
																	</tr>
																</tbody></table>

															<!--[if mso]>
															</td>
															<![endif]-->

														<!--[if mso]>
														</tr>
														</table>
														<![endif]-->
													</td>
												</tr>
											</tbody></table>
										</td>
									</tr>
								</tbody></table>
							</td>
						</tr>
					</tbody></table>

								</td>
							</tr>
						</tbody>
					</table></td>
															</tr>
														</table>
														<!--[if (gte mso 9)|(IE)]>
														</td>
														</tr>
														</table>
														<![endif]-->
													</td>
												</tr>
												<tr>
													<td align="center" valign="top" id="templateFooter" data-template-container>
														<!--[if (gte mso 9)|(IE)]>
														<table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
														<tr>
														<td align="center" valign="top" width="600" style="width:600px;">
														<![endif]-->
														<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
															<tr>
																<td valign="top" class="footerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">

					</table></td>
															</tr>
														</table>
														<!--[if (gte mso 9)|(IE)]>
														</td>
														</tr>
														</table>
														<![endif]-->
													</td>
												</tr>
											</table>
											<!-- // END TEMPLATE -->
										</td>
									</tr>
								</table>
							</center>
						</body>
					</html>`

				return htmlContent
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
