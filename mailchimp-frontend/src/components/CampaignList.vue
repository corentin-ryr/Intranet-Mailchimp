<template>
	<div>
		<h1>Mes MRI</h1>
		<v-card v-for="(key, value) in campaigns" v-bind:key="key">
			{{ value }}

				<v-btn id="gradient" class="ma-2 rounded-lg clickable" depressed v-on:click="editCampaign(key)">
					<span style="font-family: 'Avenir Next Regular'">Ouvrir campagne</span>
				</v-btn>
		</v-card>
	</div>
</template>

<script>
	export default {
		name: "MailForm",
		props: {
			msg: String,
		},

		data: () => ({
			campaigns: {},
		}),

		created() {
			this.getMyCampaigns()
		},

		methods: {
			getMyCampaigns: async function() {
				//Get campaign to modify
				var getCampaigns = this.$firebase.functions().httpsCallable("getMyCampaigns")
				const result = await getCampaigns()
				this.campaigns = result.data

				console.log(this.campaigns)
			},

			editCampaign: function(id) {
				this.$router.push({ path: `/editCampaign/${id}` })
			},
		},
	}
</script>

<style></style>
