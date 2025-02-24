export default defineNuxtRouteMiddleware((to, from) => {    
    if (to.meta.layout !== 'noauth') {
        const auth = localStorage.getItem('token')
        if (!auth) {
            console.error('You are not logged in')
            return navigateTo('/login')
        }        
    }
    
})