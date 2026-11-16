export default defineNuxtRouteMiddleware((to, from) => {
    // This middleware runs on server in SSR mode, so browser storage is unavailable there.
    if (import.meta.server) {
        return;
    }

    //console.log('middleware', APP_ENV)
    const redirectToLogin = () => {
        setPageLayout('noauth')
        return navigateTo('/login', { replace: true })
    }

    if (to.meta.layout !== 'noauth') {
        const auth = localStorage.getItem('token')
        if (!auth && APP_ENV == '') {
            console.error('You are not logged in to app')
            return redirectToLogin()
        }
    }

    var customer = localStorage.getItem('customer') ?? ''
    //console.log('fullPath', to.fullPath);
    if(customer != 'admin' && (to.path.startsWith('/admin') || to.fullPath == '/')){
        customer = customer?.slice(1);
        return navigateTo(`/my/${customer}/transaction`)
    }


})
