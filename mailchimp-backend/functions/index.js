const functions = require("firebase-functions")
const { debug } = require("firebase-functions/lib/logger")

//Setup mailchimp
const mailchimp = require("@mailchimp/mailchimp_marketing")

// Use "  firebase functions:config:set mailchimp.apikey="THE API KEY" mailchimp.server="THE CLIENT ID"  " to midify the key and server of mailchimp
mailchimp.setConfig({
	apiKey: functions.config().mailchimp.apikey,
	server: functions.config().mailchimp.server,
})

//Some constant
const testEmails = ["corentin.royer@telecom-etude.fr"]
const setHTMLContentBool = true
const sentTestEmailsBool = true

//Hello world functions for example
exports.helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", { structuredData: true })
	response.send("Hello from Firebase!")
})

// The function to create a mailchimp campaign with the attributes in arguments and then send a test email to the auditors for review
exports.createCampaignAndSendTestEmail = functions.https.onRequest((request, response) => {

    //Retrieve the arguments in request TODO
    console.log(request)
    //END TODO

    const [
		imageDomainLink,
		imagePayLink,
		imageDifficultyLink,
		contentApply,
		contentMailContact,
		contentMailTo,
	] = contentTransformations(imageDomain, imagePay, imageDifficulty, formBoolean, formLink, contactList)

	const htmlContent = contentEditHTML(
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
	)

    const campaignName = contentTitle
	const mailObject = "[Telecom Etude] " + contentTitle
	const mailFromName = "Telecom Etude"
    const mailReplyTo = contactList[0]
    
    const response = await client.campaigns.create({
		type: "regular",
		recipents: { list_id: subscriberListID },
		settings: { title: campaignName, subject_line: mailObject, from_name: mailFromName, reply_to: mailReplyTo },
	})
	const campaignID = response["id"]

    console.log("New campaign created with ID: " + campaignID)

    if (setHTMLContentBool) {
		await client.campaigns.setContent(campaignID, { html: htmlContent })
		console.log("HTML Content set")
	}

	if (sentTestEmailsBool) {
		console.log("Sending test emails to: " + testEmails)
		await client.campaigns.sendTestEmail(campaignID, {
			test_emails: testEmails,
			send_type: "html",
		})
	}

	response.status(200).send("Your campaign has been created and has been sent to the auditors")
})




// Helper functions to format the incomming data into the html email =================================================
// ===================================================================================================================

function contentTransformations(imageDomain, imagePay, imageDifficulty, formBoolean, formLink, contactList) {
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
			console.log("ERROR: the domain name is incorrect")
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
			console.log("ERROR: the pay status in incorrect")
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
			console.log("ERROR: the difficulty status in incorrect")
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
	for (var i = 0; i < contactList.length; i++) {
		var mail = contactList[i]
		contentMailTo += mail + ","
	}
	contentMailTo += "?subject=Envoi%20du%20CV%20pour%20l'%C3%A9tude%20"

	contentMailContact = "N'hésitez pas à demander plus d'informations ou de détails à "
	for (var i = 0; i < contactList.length; i++) {
		var mail = contactList[i]
		var name = mail.charAt(0).toUpperCase() + mail.substring(1, mail.indexOf("."))
		if (contactList.length == 1) {
			contentMailContact += name + " (" + mail + ")."
		} else if (i != contactList.length - 1) {
			contentMailContact += name + " (" + mail + "), "
		} else {
			contentMailContact += "et " + name + " (" + mail + ")."
		}
	}

	return [imageDomainLink, imagePayLink, imageDifficultyLink, contentApply, contentMailContact, contentMailTo]
}

function contentEditHTML(
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
}








