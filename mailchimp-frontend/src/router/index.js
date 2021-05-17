import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../components/MailForm.vue"
import Validation from "../components/Validation.vue"
import Admin from "../components/Admin.vue"
import EditCampaign from "../components/EditCampaign.vue"
import About from "../components/About.vue"

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
        path: "/campaign/:id",
        component: EditCampaign
    },
	{
		path: "/about",
		name: "About",
		component: About
    },
    {
        path: "/admin",
        name: "Admin",
        component: Admin,
    },

]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
})

export default router
