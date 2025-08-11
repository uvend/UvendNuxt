<template>
<div class="flex flex-col p-4 gap-4">
    <div class="bg-white rounded-lg p-6 shadow-lg">
        <h2 class="text-xl font-bold mb-4">Profile Settings</h2>
        
        <div class="space-y-4">
            <div>
                <Label for="nickname">Nickname</Label>
                <Input 
                    id="nickname"
                    v-model="nickname" 
                    placeholder="Enter your nickname"
                    class="mt-1"
                />
            </div>
            
            <div class="flex gap-2">
                <Button @click="updateNickname" :disabled="isUpdating">
                    {{ isUpdating ? 'Updating...' : 'Update Nickname' }}
                </Button>
                <Button @click="logout" variant="destructive">
                    Logout
                </Button>
            </div>
        </div>
    </div>
</div>
</template>
<script setup>
definePageMeta({
    layout: 'wallet'
})

import { ref, onMounted } from 'vue'

const nickname = ref('')
const isUpdating = ref(false)

async function fetchUserData() {
    try {
        // Check localStorage first for immediate updates
        const storedNickname = localStorage.getItem('user-nickname')
        if (storedNickname) {
            nickname.value = storedNickname
        }
        
        const userResponse = await useWalletAuthFetch(`${WALLET_API_URL}/user/profile`)
        const apiNickname = userResponse.nickname || ''
        nickname.value = apiNickname
        // Update localStorage with API data
        localStorage.setItem('user-nickname', apiNickname)
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
}

async function updateNickname() {
    if (!nickname.value.trim()) {
        useToast({
            title: 'Error',
            description: 'Nickname cannot be empty',
            variant: 'destructive'
        })
        return
    }
    
    isUpdating.value = true
    try {
        await useWalletAuthFetch(`${WALLET_API_URL}/user/profile`, {
            method: 'PUT',
            body: {
                nickname: nickname.value.trim()
            }
        })
        
        // Store nickname in localStorage for dashboard access
        localStorage.setItem('user-nickname', nickname.value.trim())
        
        // Dispatch custom event to notify dashboard
        window.dispatchEvent(new CustomEvent('nickname-updated', {
            detail: { nickname: nickname.value.trim() }
        }))
        
        useToast({
            title: 'Success',
            description: 'Nickname updated successfully',
            variant: 'default'
        })
    } catch (error) {
        console.error('Error updating nickname:', error)
        useToast({
            title: 'Error',
            description: 'Failed to update nickname',
            variant: 'destructive'
        })
    } finally {
        isUpdating.value = false
    }
}

function logout(){
    localStorage.clear()
    navigateTo("/");
}

onMounted(() => {
    fetchUserData()
})
</script>