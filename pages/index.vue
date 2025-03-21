<template>
    <div class="main-grid">
        <div class="ad-space bg-slate-800">
            <div class="logo-container">
                <img src="/UVendlogo-Better.png"/>
            </div>
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
                        <MyCustomerCard class="my-2 cursor-pointer" v-for="customer in searchCustomers" :customer="customer" @click="navigateTo(`/my/${customer.uniqueIdentification}/transactions`)"/> 
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default{
    data(){
        return {
            customers : [],
            isLoading: true,
            search: ''
        }
    },
    methods: {
        async getCustomers(){
            this.isLoading = true;
            const result = await useAuthFetch(`${API_URL}/AdminSystem/Customer/GetCustomerList`,{
                method: "GET"
            })
            console.log(result)
            this.customers = result.list.listOfDefinitions
            this.isLoading = false;
        }
    },
    mounted(){
        this.getCustomers();
    },
    computed: {
        searchCustomers(){
            this.customers = this.customers.sort((a,b)=>{
                let descA = a.description.toLowerCase();
                let descB = b.description.toLowerCase();
                if (descA < descB) {
                    return -1;
                }
                if (descA > descB) {
                    return 1;
                }
                return 0; // descriptions are equal
            })
            this.customers = this.customers.filter(customer => {
                if(customer.accountStatus != "Active"){
                    console.log(customer);
                }
                return customer.accountStatus === "Active" && !customer.is_deleted;
            })
            if(this.search == ''){
                return this.customers;
            }
            return this.customers.filter(customer => {
                console.log(customer.accountStatus)
                return customer.description.toLowerCase().includes(this.search.toLowerCase());
            });

        }
    }
}
</script>
<style scoped>
.main-grid{
    display: grid;
    grid-template-columns: auto min-content;
}
.customer-container{
    height: 300px;
    overflow: scroll;
}
.search-input{
    margin: 20px auto;
    border: 0;
}
.search-input:focus-visible{
    border: 0;
}
.profile-grid{
    display: grid;
    grid-template-rows: min-content auto;
    overflow: hidden;
    height: calc(100vh);
}
.customer-container{
    overflow-y: scroll;
    height: calc(100vh - 50px);
}

.logo-container img{
    padding: 10px;
    width: 230px;
}
.main-grid{
    display: grid;
    grid-template-columns: auto min-content;
}
</style>