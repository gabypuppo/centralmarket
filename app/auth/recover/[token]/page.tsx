import NotFoundError from '@/components/error/NotFountError'
import UnauthorizedError from '@/components/error/UnauthorizedError'
import { changePassword, getUser } from '@/db/users'
import { deleteTokens, validateVerificationToken } from '@/db/verificationTokens'
import { redirect } from 'next/navigation'
import React from 'react'
import ChangePasswordForm from './components/ChangePasswordForm'

export default async function Page({ params, searchParams }: { params: { token: string }, searchParams?:{ [key: string]: string | undefined } }) {
  if (!searchParams?.email) {
    return <NotFoundError>Email not found</NotFoundError>
  }
  const email = searchParams.email

  const user = await getUser(email)

  if (!user) {
    return <NotFoundError>User not found</NotFoundError>
  }

  const res = validateVerificationToken(user?.id, params.token)

  if (!res) {
    return <UnauthorizedError>Invalid verification token</UnauthorizedError>
  }

  const updatePassword = async (formData: FormData) => {
    'use server'
    const password = formData.get('password') as string
    const repeatPassword = formData.get('repeat-password') as string

    if (password !== repeatPassword) return 'Las contraseñas no coinciden.'

    await changePassword(user.id, password)
    await deleteTokens(user.id)
    redirect('/auth/login')
  }

  return (
    <div className="h-screen">
      <main className="screen h-screen flex flex-col space-y-5 justify-center items-center text-black">
        <h1 className="text-lg">Recupera tu Contraseña</h1>
        <ChangePasswordForm action={updatePassword} />
      </main>
    </div>
  )
}
