export default function fetch<T>(url: string, options: any = {}) {
    //const token = btoa('jaredlee@admin:jared1');
    try{
      const accessToken = localStorage.getItem('wallet-access-token');
      const refreshToken = localStorage.getItem('wallet-refresh-token');
      return $fetch<T>(url, {
        headers: {
          //Authorization: token ? `Basic ${token}` : "",
          "X-Stack-Access-Token" : accessToken,
          "X-Stack-Refresh-Token" : refreshToken,
          ...options.headers, // Merge custom headers
        },
        ...options, // Merge other options
      })
    }catch(error){
      console.log(error)
    }
    
  }