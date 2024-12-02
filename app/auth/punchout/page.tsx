import { signIn } from '@/auth'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { useCallback } from 'react'
import { PunchoutLoginForm } from './components/login'

export default function PunchoutLogin({ searchParams }: { searchParams: { token: string } }) {
  const action = useCallback(async () => {
    'use server'
    try {
      console.log(searchParams.token)
      return await signIn('credentials', {
        redirectTo: '/app',
        token: searchParams.token,
      })
    } catch (err) {
      if (isRedirectError(err)) {
        throw err
      }
    }
  },[searchParams])

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="px-4 py-8 sm:px-16 space-y-4">
          <PunchoutLoginForm action={action}/>
        </div>
      </div>
    </div>
  )
}
