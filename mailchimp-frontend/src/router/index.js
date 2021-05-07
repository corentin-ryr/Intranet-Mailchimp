import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../components/MailForm.vue"
import Validation from "../components/Validation.vue"
import Admin from "../components/Admin.vue"
import EditCampaign from "../components/EditCampaign.vue"

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
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../components/About.vue"),
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
