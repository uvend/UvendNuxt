export default function fetch<T>(url: string, options: any = {}) {
    const token = btoa('jaredlee@admin:jared1');
    return $fetch<T>(url, {
      headers: {
        Authorization: token ? `Basic ${token}` : "",
        ...options.headers, // Merge custom headers
      },
      ...options, // Merge other options
    })
  }