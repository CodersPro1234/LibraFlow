import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      login: (user, token, role) => set({ user, token, role }),
      logout: () => set({ user: null, token: null, role: null }),
    }),
    {
      name: 'libraflow-auth',
    }
  )
)

export default useAuthStore