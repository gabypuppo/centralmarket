import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcrypt-ts'
import { getUser, getUserWithPassword } from '@/db/users'
import { authConfig } from './auth.config'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password }: any) {
        const user = await getUserWithPassword(email)
        if (!user) return null
        const passwordsMatch = await compare(password, user.password!)
        if (passwordsMatch) return user as any
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      if (!session.user || !session.user.email) return session
      const user = await getUser(session.user?.email)
      if (!user) return session
      session.user = user
      return session
    }
  }
})
