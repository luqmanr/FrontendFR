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
import TestPage from '@/tests/TestPage.vue'

const routes = [
    {path: '/', component: ImageUploader},
    {path: '/registrationimage', component: RegistrationImage},
    {path: '/deleteuser', component: DeleteUser},
    {path: '/listuser', component: ListUser},
    {path: '/login', component: LoginPage},
    {path: '/absensi', component: ImageUploader},
    {path: '/checkattendance', component: CheckAttendancePage},

    {path: '/testpage', component: TestPage}
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router