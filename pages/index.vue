<template>
    <div class="profile-grid h-full">
        <div class="flex justify-between py-2 px-4">
            <div></div>
            <MyUserMenu />
        </div>
        <div class="p-4 h-full w-[450px]">
            <div class="flex items-center gap-2 mb-8">
                <Icon name="lucide:search" />
                <Input type="text" v-model="search" class="focus-visible:ring-0 border-0" placeholder="Search"/>
            </div>
            <div class="">
                <div v-if="isLoading">
                    <MySkeletenCardList :columns="1"/>
                </div>
                <div v-else class="customer-container hide-scrollbar">
                    <MyCustomerCard class="my-2 cursor-pointer" v-for="customer in searchCustomers" :customer="customer" @click="navigateTo(`/my/${customer.uniqueIdentification}`)"/> 
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
            if(this.search == ''){
                return this.customers;
            }
            return this.customers.filter(customer => {
                return customer.description.toLowerCase().includes(this.search.toLowerCase());
            });

        }
    }
}
</script>
<style scoped>
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
</style>