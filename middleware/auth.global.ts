export default defineNuxtRouteMiddleware((to, from) => {    
    //console.log('middleware')
    if (to.meta.layout !== 'noauth') {
        const auth = localStorage.getItem('token')
        if (!auth) {
            console.error('You are not logged in')
            return navigateTo('/login')
        }
    }

    var customer = localStorage.getItem('customer') ?? ''
    //console.log('fullPath', to.fullPath);
    if(customer != 'admin' && (to.path.startsWith('/admin') || to.fullPath == '/')){
        customer = customer?.slice(1);
        return navigateTo(`/my/${customer}/transaction`)
    }

})