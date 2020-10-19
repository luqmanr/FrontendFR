import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)

// route components imports
import RegistrationImage from '@/pages/FaceRegistrationPage'
import ImageUploader from '@/pages/FaceAttendancePage'
import DeleteUser from '@/pages/DeleteUserPage'
import ListUser from '@/pages/ListUserPage'
import LoginPage from '@/pages/LoginPage'
import CheckAttendancePage from '@/pages/CheckAttendancePage'

// testing route import
import LivenessDemo from '@/components/LivenessDemo'
import LivenessDemov1dot1 from '@/components/LivenessDemo/index-v1.1.vue'
import TestPage from '@/tests/TestPage.vue'

const routes = [
    {path: '/', component: ImageUploader},
    {path: '/registrationimage', component: RegistrationImage},
    {path: '/deleteuser', component: DeleteUser},
    {path: '/listuser', component: ListUser},
    {path: '/login', component: LoginPage},
    {path: '/absensi', component: ImageUploader},
    {path: '/checkattendance', component: CheckAttendancePage},

    {path: '/livenessdemo', component: LivenessDemo},
    {path: '/livenessdemo-v1.1', component: LivenessDemov1dot1},
    {path: '/testpage', component: TestPage}

]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router