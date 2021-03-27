const functions = require("firebase-functions")
const { debug } = require("firebase-functions/lib/logger")
const admin = require("firebase-admin")
admin.initializeApp()

const db = admin.firestore()

//Setup mailchimp
const mailchimp = require("@mailchimp/mailchimp_marketing")

// Use "  firebase functions:config:set mailchimp.apikey="THE API KEY" mailchimp.server="THE CLIENT ID mailchimp.subscriberlistid="SUBSCRIBER LIST ID"  " to midify the key and server of mailchimp
mailchimp.setConfig({
	apiKey: functions.config().mailchimp.apikey,
	server: functions.config().mailchimp.server,
})

//Some constant
// const testEmails = ["responsable.commercial@telecom-etude.fr", "secretaire.general@telecom-etude.fr"]
const testEmails = ["hugo.queinnec@telecom-etude.fr", "corentin.royer@telecom-etude.fr"]
const setHTMLContentBool = true
const sentTestEmailsBool = true

// The function to create a mailchimp campaign with the attributes in arguments and then send a test email to the auditors for review
exports.createCampaignAndSendTestEmail = functions.https.onCall(async (data, context) => {
	// Checking that the user is authenticated.
	if (!context.auth) {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.")
	}

	//Format the data for the next function
	const [
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
		contentMailTo,
	] = await checkAndFormatData(data)

	//Generate the html content
	const htmlContent = await contentEditHTML(
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
	const mailReplyTo = contactList[0] //Or set it to candidature@telecom-etude.fr ?

	console.log("Creating the campaing...")

	const result = await mailchimp.campaigns.create({
		type: "regular",
		recipents: { list_id: functions.config().mailchimp.subscriberlistid },
		settings: { title: campaignName, subject_line: mailObject, from_name: mailFromName, reply_to: mailReplyTo },
	})
	const campaignID = result["id"]

	console.log("New campaign created with ID: " + campaignID)

	if (setHTMLContentBool) {
		await mailchimp.campaigns.setContent(campaignID, { html: htmlContent })
		console.log("HTML Content set")
	}

	if (sentTestEmailsBool) {
		console.log("Sending test emails to: " + testEmails)
		try {
			await mailchimp.campaigns.sendTestEmail(campaignID, {
				test_emails: testEmails,
				send_type: "html",
			})
		} catch (error) {
			throw new functions.https.HttpsError("internal", "Error with mailchimp.")
		}
	}

	return "Your campaign has been created and has been sent to the auditors"
})

//The function to get the preview email
exports.getPreviewEmail = functions.https.onCall(async (data, context) => {
	// Checking that the user is authenticated.
	if (!context.auth) {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.")
	}

	//Format the data for the next function
	const [
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
		contentMailTo,
	] = await checkAndFormatData(data)

	//Generate the html content
	const htmlContent = await contentEditHTML(
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

	return htmlContent
})

// Helper functions to format the incomming data into the html email =================================================
// ===================================================================================================================
// ===================================================================================================================

/**
 *
 * @param {*} data dictionary of email content (e.g: key=contentTitle, value="Titre de l'étude")
 */
async function checkAndFormatData(data) {
	//Check if all data has been sent
	if (
		!data.contentTitle ||
		!data.contentFirstDescription ||
		!data.contentDomain ||
		!data.contentPay ||
		!data.contentDifficulty ||
		!data.contentSkills ||
		!data.contentSchedule ||
		!data.imageDomain ||
		!data.imagePay ||
		!data.imageDifficulty ||
		//!data.formBoolean ||
		(data.formBoolean == true && !data.formLink)
	) {
		throw new functions.https.HttpsError("invalid-argument", "Not all fields are filled.")
	}

	//Raw data
	contentTitle = data.contentTitle
	contentFirstDescription = data.contentFirstDescription
	contentDomain = data.contentDomain
	contentPay = data.contentPay
	contentDifficulty = data.contentDifficulty
	contentSkills = data.contentSkills
	contentSchedule = data.contentSchedule
	contentDescription = data.contentDescription

	//Data to transform
	imageDomain = data.imageDomain
	imagePay = data.imagePay
	imageDifficulty = data.imageDifficulty
	formBoolean = data.formBoolean
	formLink = data.formLink

	contactList = data.contactList

	const [
		imageDomainLink,
		imagePayLink,
		imageDifficultyLink,
		contentApply,
		contentMailContact,
		contentMailTo,
	] = await contentTransformations(imageDomain, imagePay, imageDifficulty, formBoolean, formLink, contactList)

	return [
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
		contentMailTo,
	]
}

async function contentTransformations(imageDomain, imagePay, imageDifficulty, formBoolean, formLink, contactList) {
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
				"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/4d65cc38-f99c-4eb5-bd8b-f4c58d44aecb.png"
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
			throw new functions.https.HttpsError("invalid-argument", "The domain image name is incorrect.")
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
			throw new functions.https.HttpsError("invalid-argument", "The pay image name is incorrect.")
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
			throw new functions.https.HttpsError("invalid-argument", "The difficulty image name is incorrect.")
	}

    if (formBoolean) {
        const templates_ref = db.collection("global_const").doc("templates")
        const templates = await templates_ref.get()
        
        contentApply = templates.data()["templateForm"]
        contentApply = contentApply.replace("FORM_LINK", formLink)

    } else {
        const templates_ref = db.collection("global_const").doc("templates")
        const templates = await templates_ref.get()
        
        contentApply = templates.data()["templateNoForm"]
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

async function contentEditHTML(
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
	const templates_ref = db.collection("global_const").doc("templates")
    const templates = await templates_ref.get()
    
    htmlContent = templates.data()["templateBody"].toString()
    console.log(typeof htmlContent)

	htmlContent = htmlContent.replace("CONTENT_TITLE", contentTitle)
	htmlContent = htmlContent.replace("CONTENT_FIRST_DESCRIPTION", contentFirstDescription)
	htmlContent = htmlContent.replace("CONTENT_DOMAIN", contentDomain)
	htmlContent = htmlContent.replace("IMAGE_DOMAIN_LINK", imageDomainLink)
	htmlContent = htmlContent.replace("CONTENT_PAY", contentPay)
	htmlContent = htmlContent.replace("IMAGE_PAY_LINK", imagePayLink)
	htmlContent = htmlContent.replace("CONTENT_DIFFICULTY", contentDifficulty)
	htmlContent = htmlContent.replace("IMAGE_DIFFICULTY_LINK", imageDifficultyLink)
	htmlContent = htmlContent.replace("CONTENT_SKILLS", contentSkills)
	htmlContent = htmlContent.replace("CONTENT_SCHEDULE", contentSchedule)
	htmlContent = htmlContent.replace("CONTENT_DESCRIPTION", contentDescription)
	htmlContent = htmlContent.replace("CONTENT_APPLY", contentApply)
	htmlContent = htmlContent.replace("CONTENT_MAIL_CONTACT", contentMailContact)
	htmlContent = htmlContent.replace("CONTENT_MAILTO", contentMailTo)

	return htmlContent
}
