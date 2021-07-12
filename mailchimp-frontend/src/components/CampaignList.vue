<template>
	<div>
		<v-card-title
			style="font-family: 'Avenir Next Regular'; justify-content: west;"
			class="text-wrap pt-10 pb-0"
		>
			<h1>MES MRI</h1>
		</v-card-title>
		<v-card-title
			style="font-family: 'Avenir Next Regular'; justify-content: west;"
			class="text-wrap pt-3 pb-5 pl-4"
		>
			<h3>Liste de mes études</h3>
		</v-card-title>

		<v-expand-transition>
			<div v-if="loadingVisibility">
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

		<div v-if="!loadingVisibility">
			<v-card v-for="(key, value) in campaigns" v-bind:key="value.id" class="ma-4" outlined>
				<div class="pa-2">
					<p class="pa-1 ma-0">
						{{ value }}
					</p>
					<div style="display: flex; justify-content: flex-end">
						<v-btn 
							class="mx-1 pa-1"
							color="#707070"
							outlined
							depressed
							v-on:click="editCampaign(key.id)">
							<span style="font-family: 'Avenir Next Regular';font-size: min(3vw, 14px);">Modifier</span>
						</v-btn>
					</div>
				</div>
			</v-card>
		</div>
	</div>
</template>

<script>
	/**
	 * This page shows the list of unvalidated campaigns that the user owns 
     * (i.e : the user is in the contact list of that campaign) and that are not yet validated.
	 * The user can open one of these campaign to edit it.
	 * @example [none]
	 */
	export default {
		name: "MailForm",

		data: () => ({
			campaigns: {},
			loadingVisibility: true,
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
				this.loadingVisibility = false
			},

			editCampaign: function(id) {
				this.$router.push({ path: `/editCampaign/${id}` })
			},
		},
	}
</script>

<style></style>
