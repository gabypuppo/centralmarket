'use client'

import type { User } from '@/db/users'
import { getUserAction } from '@/utils/actions'
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  clearUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      return await getUserAction()
    }

    getUser().then((user) => {
      setUser(user)
    })
  }, [])

  const clearUser = () => setUser(null)

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>{children}</UserContext.Provider>
  )
}
