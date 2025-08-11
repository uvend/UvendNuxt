export default defineNuxtRouteMiddleware((to, from) => {
    const config = useRuntimeConfig()
    const APP_ENV = config.public.APP_ENV
    
    //console.log('middleware', APP_ENV)
    const path = to.path.split('/');
    if (to.meta.layout !== 'noauth') {
        let redirect = false;
        const auth = localStorage.getItem('token')
        const walletAuth = localStorage.getItem('wallet-access-token');
        if (!auth && APP_ENV == '') {
            console.error('You are not logged in to app')
            return navigateTo('/login')
        }else if(!walletAuth && APP_ENV == 'wallet'){
            console.error('You are not logged in to wallet')
            return navigateTo('/login')
        }
        // For registration, no authentication check needed - let them access registration form
    }

    // For wallet system, root path should show wallet index (no redirect needed)
    if (APP_ENV == 'wallet' && (to.path === '/' || to.path === '')) {
        return; // Let it show the wallet index page
    }

    // For registration system, allow access to registration pages without authentication
    if (APP_ENV == 'registration') {
        return; // Let them access registration pages
    }

    var customer = localStorage.getItem('customer') ?? ''
    //console.log('fullPath', to.fullPath);
    if(customer && customer != 'admin' && (to.path.startsWith('/admin') || to.fullPath == '/')){
        return navigateTo(`/my/${customer}/transactions`)
    } else if (!customer && (to.path.startsWith('/admin') || to.fullPath == '/')) {
        return navigateTo('/login')
    }


})