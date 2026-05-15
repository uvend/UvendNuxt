export default defineNuxtRouteMiddleware((to, from) => {
    // This middleware runs on server in SSR mode, so browser storage is unavailable there.
    if (import.meta.server) {
        return;
    }

    //console.log('middleware', APP_ENV)
    const path = to.path.split('/');
    const redirectToLogin = () => {
        setPageLayout('noauth')
        return navigateTo('/login', { replace: true })
    }

    if (to.meta.layout !== 'noauth') {
        let redirect = false;
        const auth = localStorage.getItem('token')
        const walletAuth = localStorage.getItem('wallet-access-token');
        if (!auth && APP_ENV == '') {
            console.error('You are not logged in to app')
            return redirectToLogin()
        }else if(!walletAuth && APP_ENV == 'wallet'){
            console.error('You are not logged in to wallet')
            return redirectToLogin()
        }
    }

    if(['wallet'].includes(APP_ENV)){
        return;
    }

    var customer = localStorage.getItem('customer') ?? ''
    //console.log('fullPath', to.fullPath);
    if(customer != 'admin' && (to.path.startsWith('/admin') || to.fullPath == '/')){
        customer = customer?.slice(1);
        return navigateTo(`/my/${customer}/transaction`)
    }


})
