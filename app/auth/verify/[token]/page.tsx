import { auth } from '@/auth'
import ValidationButton from '@/components/auth/ValidationButton'
import { getUser, verifyUser } from '@/db/users'
import { validateVerificationToken } from '@/db/verificationTokens'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { token: string } }) {
  const session = await auth()
  const user = await getUser(session?.user?.email!)

  if (!user || user?.isVerified) return redirect('/app')

  try {
    const token = params.token
    const isValidToken = await validateVerificationToken(user.id, token)

    if (isValidToken) verifyUser(user.id)
    return (
      <div className="flex h-screen">
        <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center text-black">
          Your email has been successfully verified.
          <Link href="/" className="underline">
            Go to App
          </Link>
        </div>
      </div>
    )
  } catch (error: Error | any) {
    return (
      <div className="flex h-screen">
        <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center text-black">
          {error instanceof Error && <p>{error.message}</p>}
          <ValidationButton user={user} />
        </div>
      </div>
    )
  }
}
