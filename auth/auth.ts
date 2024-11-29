import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcrypt-ts'
import jwt from 'jsonwebtoken'
import { getUser, getUserWithPassword } from '@/db/users'
import { authConfig } from './auth.config'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password, token }: any) {
        if (token) {
          const payload: any = jwt.verify(
            token,
            process.env.AUTH_SECRET ?? '',
            { issuer: process.env.AUTH_ISSUER },
          )

          const user = await getUserWithPassword(payload?.email)
          return { ...user, punchout: payload.punchout }
        }

        const user = await getUserWithPassword(email)
        if (!user) return null
        const passwordsMatch = await compare(password, user.password!)
        if (passwordsMatch) return user as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      const punchout = (user as any)?.punchout
      return { punchout, ...token }
    },
    async session({ session, token }) {
      if (!session.user || !session.user.email)
        return { ...session, user: { ...session.user, ...token } }
      const user = await getUser(session.user?.email)
      if (!user) return session
      session.user = { ...token, ...user }
      return session
    },
  },
})
