const functions = require("firebase-functions")
const { debug } = require("firebase-functions/lib/logger")

//Setup mailchimp
const mailchimp = require("@mailchimp/mailchimp_marketing")

mailchimp.setConfig({
	apiKey: "APIKEY",
	server: "SERVER",
})


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
exports.helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", { structuredData: true })
	response.send("Hello from Firebase!")
})

exports.createCampaignMailchimp = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", { structuredData: true })
    debug(request)

	response.status(200).send("Hello from Firebase!")
})
