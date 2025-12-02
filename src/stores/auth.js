import { defineStore } from 'pinia'
import api from 'src/services/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: sessionStorage.getItem('token') || null
    }),

    actions: {
        async login(email, password) {
            const { data } = await api.post('/login', { email, password })
            this.token = data.access_token
            sessionStorage.setItem('token', this.token)

        },


        logout() {
            this.user = null
            this.token = null
            sessionStorage.removeItem('token')
        }

    }
})