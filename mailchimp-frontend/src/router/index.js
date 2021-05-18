import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../components/NewCampaign.vue"
import Validation from "../components/Validation.vue"
import Admin from "../components/Admin.vue"
import EditCampaign from "../components/EditCampaign.vue"
import CampaignList from "../components/CampaignList.vue"

Vue.use(VueRouter)

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
    {
        path: "/validation",
        name: "Validation",
        component: Validation,
    },
    {
        path: "/valCampaign/:id",
        component: EditCampaign,
        props: {validation: true}
    },
    {
        path: "/editCampaign/:id",
        component: EditCampaign,
        props: {validation: false}
    },
    {
        path: "/admin",
        name: "Admin",
        component: Admin,
    },
    {
        path: "/myCampaigns",
        name: "CampaignList",
        component: CampaignList,
    },

]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
})

export default router
