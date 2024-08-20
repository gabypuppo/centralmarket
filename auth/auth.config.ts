import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: { signIn: '/auth/login' },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/app')
      const isOnVerify = nextUrl.pathname.startsWith('/auth/verify')
      const isOnRecover = nextUrl.pathname.startsWith('/auth/recover')

      if (isOnDashboard) return isLoggedIn // Redirect unauthenticated users to login page
      if (isOnRecover) return !isLoggedIn
      if (isOnVerify && !auth?.user.isVerified) return true
      if (isLoggedIn) return Response.redirect(new URL('/app', nextUrl))
      return true
    }
  }
} satisfies NextAuthConfig
