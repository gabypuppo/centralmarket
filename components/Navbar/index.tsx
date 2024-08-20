import { auth } from '@/auth'
import Link from 'next/link'

export default async function Navbar() {
  const session = await auth()
  const user = session ? session.user : null

  return (
    <div className="flex justify-between items-center h-16 bg-white text-black shadow-sm">
      <div className="flex items-center">
        <span className="font-bold pl-4">
          <Link href={'/'}>Central Market</Link>
        </span>
      </div>
      <div className="flex items-center">
        {user?.role === 'admin' && (
          <>
            <span className="mr-4">
              <Link href={'/app/orders'}>Mis pedidos</Link>
            </span>
            <span className="mr-4">
              <Link href={'/app/organization'}>Mi organización</Link>
            </span>
          </>
        )}
        {user?.organizationId === 1 && user?.role === 'admin' && (
          <span className="mr-4">
            <Link href={'/app/organizations'}>Organizaciones</Link>
          </span>
        )}
        <span className="mr-4">
          <Link href={'/app/profile'}>Perfil</Link>
        </span>
      </div>
    </div>
  )
}
