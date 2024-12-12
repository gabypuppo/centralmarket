import { auth } from '@/auth'
import Navbar from '@/app/app/components/Navbar'
import SignOutButton from '@/components/auth/SignOutButton'
import ValidationButton from '@/components/auth/ValidationButton'
import NotFoundError from '@/components/error/NotFountError'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (session?.user === null) return

  if (!session?.user.organizationId)
    return (
      <NotFoundError>
        <p className="text-center text-muted-foreground">
          Este usuario no esta asignado a ninguna organización.
        </p>
        <div className="mt-4 flex justify-center">
          <SignOutButton />
        </div>
      </NotFoundError>
    )

  return (
    <div>
      <Navbar />
      {session?.user?.isVerified ? (
        children
      ) : (
        <div className="flex h-screen">
          <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center text-black">
            <p>
              Te registraste como {session?.user?.email}. Para continuar en la plataforma, por favor
              valida tu email para confirmar tu cuenta.
            </p>
            {session?.user && <ValidationButton user={session?.user} />}
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  )
}
