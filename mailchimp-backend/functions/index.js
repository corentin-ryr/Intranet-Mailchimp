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
const testEmails = ["responsable.commercial@telecom-etude.fr", "secretaire.general@telecom-etude.fr"]
//const testEmails = ["hugo.queinnec@telecom-etude.fr", "corentin.royer@telecom-etude.fr"]
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
	data = await checkAndFormatData(data)

	//Generate the html content
	const htmlContent = await contentEditHTML(data)

	const campaignName = data.contentTitle
	const mailObject = "[Telecom Etude] " + data.contentTitle
	const mailFromName = "Telecom Etude"
	const mailReplyTo = data.contactList[0] //Or set it to candidature@telecom-etude.fr ?

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

	return "Your campaign has been created and has been sent to the auditors."
})

//The function to get the preview email
exports.getPreviewEmail = functions.https.onCall(async (data, context) => {
	// Checking that the user is authenticated.
	if (!context.auth) {
		// Throwing an HttpsError so that the client gets the error details.
		throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.")
	}

	//Format the data for the next function
	data = await checkAndFormatData(data)

	//Generate the html content
	const htmlContent = await contentEditHTML(data)

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

	data = await contentTransformations(data)

	return data
}

async function contentTransformations(data) {
	switch (data.imageDomain) {
		case "data":
			data.imageDomainLink =
				"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/3f084638-6053-45c6-a99e-7ad481f340fc.png"
			break
		case "dev":
			data.imageDomainLink =
				"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/458e3a19-7fe7-4471-aad4-8d19e43f2383.png"
			break
		case "cyber":
			data.imageDomainLink =
				"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/4d65cc38-f99c-4eb5-bd8b-f4c58d44aecb.png"
			break
		case "se":
			data.imageDomainLink =
				"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/ad81493a-5281-4772-adef-4bcebee00243.png"
			break
		case "image":
			data.imageDomainLink =
				"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/863635c4-6fc0-42d0-add6-7c4b8aa04b9b.png"
			break
		case "etude":
			data.imageDomainLink =
				"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/0104e278-2e89-44d0-823f-86e2e92a1e70.png"
			break
		default:
			console.log("ERROR: the domain name is incorrect")
			throw new functions.https.HttpsError("invalid-argument", "The domain image name is incorrect.")
	}

	switch (data.imagePay) {
		case "low":
			data.imagePayLink =
				"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/aa0aa2c2-9aaf-46f8-ae91-8c28953b02bc.png"
			break
		case "middle":
			data.imagePayLink =
				"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/d790eeff-772d-4aa7-91a0-f1883414b675.png"
			break
		case "high":
			data.imagePayLink =
				"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/7781ba0c-a348-4722-ba77-beee6bbb5f51.png"
			break
		default:
			console.log("ERROR: the pay status in incorrect")
			throw new functions.https.HttpsError("invalid-argument", "The pay image name is incorrect.")
	}

	switch (data.imageDifficulty) {
		case "low":
			data.imageDifficultyLink =
				"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/b30e558d-f0e5-489a-80ba-681d27021c0a.png"
			break
		case "middle":
			data.imageDifficultyLink =
				"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/1f020378-3a07-4a5b-892c-62fd7822e9f0.png"
			break
		case "high":
			data.imageDifficultyLink =
				"https://mcusercontent.com/d64b9431d63c83512b8b612ee/images/93539be4-2afc-4c5f-a34e-f09fa0daa6b1.png"
			break
		default:
			console.log("ERROR: the difficulty status in incorrect")
			throw new functions.https.HttpsError("invalid-argument", "The difficulty image name is incorrect.")
	}

	if (data.formBoolean) {
		const templates_ref = db.collection("global_const").doc("templates")
		const templates = await templates_ref.get()

		data.contentApply = templates.data()["templateForm"]
		data.contentApply = data.contentApply.replace("FORM_LINK", data.formLink)
	} else {
		const templates_ref = db.collection("global_const").doc("templates")
		const templates = await templates_ref.get()

		data.contentApply = templates.data()["templateNoForm"]
	}

	contentMailTo = "mailto:"
	for (var i = 0; i < data.contactList.length; i++) {
		var mail = data.contactList[i]
		contentMailTo += mail + ","
	}
	contentMailTo += "?subject=Envoi%20du%20CV%20pour%20l'%C3%A9tude%20"
	data.contentMailTo = contentMailTo

	contentMailContact = "N'hésitez pas à demander plus d'informations ou de détails à "
	for (var i = 0; i < data.contactList.length; i++) {
		var mail = data.contactList[i]
		var name = mail.charAt(0).toUpperCase() + mail.substring(1, mail.indexOf("."))
		if (data.contactList.length == 1) {
			contentMailContact += name + " (" + mail + ")."
		} else if (i != data.contactList.length - 1) {
			contentMailContact += name + " (" + mail + "), "
		} else {
			contentMailContact += "et " + name + " (" + mail + ")."
		}
	}
	data.contentMailContact = contentMailContact

	return data
}

async function contentEditHTML(data) {
	const templates_ref = db.collection("global_const").doc("templates")
	const templates = await templates_ref.get()

	htmlContent = templates.data()["templateBody"].toString()
	console.log(typeof htmlContent)

	htmlContent = htmlContent.replace("CONTENT_TITLE", data.contentTitle)
	htmlContent = htmlContent.replace("CONTENT_FIRST_DESCRIPTION", data.contentFirstDescription)
	htmlContent = htmlContent.replace("CONTENT_DOMAIN", data.contentDomain)
	htmlContent = htmlContent.replace("IMAGE_DOMAIN_LINK", data.imageDomainLink)
	htmlContent = htmlContent.replace("CONTENT_PAY", data.contentPay)
	htmlContent = htmlContent.replace("IMAGE_PAY_LINK", data.imagePayLink)
	htmlContent = htmlContent.replace("CONTENT_DIFFICULTY", data.contentDifficulty)
	htmlContent = htmlContent.replace("IMAGE_DIFFICULTY_LINK", data.imageDifficultyLink)
	htmlContent = htmlContent.replace("CONTENT_SKILLS", data.contentSkills)
	htmlContent = htmlContent.replace("CONTENT_SCHEDULE", data.contentSchedule)
	htmlContent = htmlContent.replace("CONTENT_DESCRIPTION", data.contentDescription)
	htmlContent = htmlContent.replace("CONTENT_APPLY", data.contentApply)
	htmlContent = htmlContent.replace("CONTENT_MAIL_CONTACT", data.contentMailContact)
	htmlContent = htmlContent.replace("CONTENT_MAILTO", data.contentMailTo)

	return htmlContent
}
