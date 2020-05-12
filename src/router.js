import Vue from 'vue'
import Router from 'vue-router'
import ActivityMobile from "@/components/ActivityMobile";


Vue.use(Router)

const router = new Router(
    {
        routes: [
            {path: '/', redirect: '/activity'},
            {path: '/activity', component: ActivityMobile}

        ]
    }
)

export default router
