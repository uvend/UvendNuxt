export default defineNuxtRouteMiddleware((to, from) => {    
    //console.log('middleware')
    const path = to.path.split('/');
    if (to.meta.layout !== 'noauth') {
        const auth = localStorage.getItem('token')
        if (!auth) {
            // console.error('You are not logged in')
            return navigateTo('/login')
        }
    }

    // protect wallet routes
    if(path[1] == "wallet" && path[2] != "login"){
        const wallet_access_token = localStorage.getItem("wallet-access-token");
        if(!wallet_access_token){
            return navigateTo(`/wallet/login`);
        }
    }

    var customer = localStorage.getItem('customer') ?? ''
    //console.log('fullPath', to.fullPath);
    if(customer != 'admin' && (to.path.startsWith('/admin') || to.fullPath == '/')){
        customer = customer?.slice(1);
        return navigateTo(`/my/${customer}/transaction`)
    }


})