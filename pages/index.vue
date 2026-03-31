<template>
    <div class="main-grid">
        <div class="bg-image">
            <MyLogo />
        </div>
        <div class="profile-grid flex h-full">
            <div class="flex justify-between py-2 px-4">
                <div></div>
                <MyUserMenu />
            </div>
            <div class="p-20 h-full w-[500px]">
                <div class="flex items-center gap-2 mt-20 mb-8">
                    <Icon name="lucide:search" />
                    <Input type="text" v-model="search" class="focus-visible:ring-0 border-0" placeholder="Search"/>
                </div>
                <div class="">
                    <MySkeletenCardList v-if="isLoading" :columns="1"/>
                    <div v-else class="customer-container hide-scrollbar">
                        <MyCustomerCard class="my-2 cursor-pointer" v-for="customer in customers" :customer="customer" @click="navigateTo(`/my/${customer.uniqueidentification}/dashboard`)"/> 
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { debounce } from 'lodash'
export default {
    data() {
        return {
            customers: [],
            isLoading: true,
            search: ''
        }
    },
    mounted() {
        this.getCustomers()
    },
    methods: {
        async getCustomers() {
            try {
                // Fix malformed CUSTOMER_API URL
                let baseUrl = CUSTOMER_API || 'https://customer-api.uatvend.co.za'
                
                // If the URL contains two domains concatenated, extract the first one
                if (baseUrl.includes('https://') && baseUrl.indexOf('https://', 8) !== -1) {
                    baseUrl = baseUrl.substring(0, baseUrl.indexOf('https://', 8))
                }
                
                // Ensure it ends with a slash if needed
                if (!baseUrl.endsWith('/')) {
                    baseUrl += '/'
                }
                
                const result = await useAuthFetch(`${baseUrl}customer`, {
                    method: "GET",
                    query: {
                        page: 1,
                        limit: 100,
                        search: this.search
                    }
                })
                this.customers = result.data
                console.log(this.customers)
            } catch (error) {
                console.error('Error fetching customers:', error)
            } finally {
                this.isLoading = false
            }
        }
    },
    computed: {
        // bgColor computed property removed since we're using the image
    },
    watch: {
        search: {
            handler: debounce(function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.getCustomers()
                }
            }, 400),
            immediate: false
        }
    }
}
</script>
<style scoped>
.bg-image {
    background-image: url('/assets/css/login/Background.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: background-image 0.3s;
}
.main-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
}
.customer-container {
    height: 300px;
    overflow: scroll;
}
.search-input {
    margin: 20px auto;
    border: 0;
}
.search-input:focus-visible {
    border: 0;
}
.profile-grid {
    display: grid;
    grid-template-rows: min-content auto;
    overflow: hidden;
    height: calc(100vh);
}
.customer-container {
    overflow-y: scroll;
    height: calc(100vh - 50px);
}

.logo-container img {
    padding: 10px;
    width: 230px;
}
</style>