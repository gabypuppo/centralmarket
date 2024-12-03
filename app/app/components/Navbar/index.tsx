import { auth } from '@/auth'
import { hasPermission } from '@/auth/authorization'
import Link from 'next/link'

export default async function Navbar() {
  const session = await auth()
  const user = session?.user

  return (
    <div className="flex justify-between items-center h-16 bg-white text-black shadow-sm">
      <div className="flex items-center">
        <span className="font-bold pl-4">
          <Link href={'/'}>Central Market</Link>
        </span>
      </div>
      <div className="flex items-center">
        <span className="mr-4">
          <Link href={'/app/orders'}>
            {user && hasPermission(user, 'orders', 'read') ? 'Pedidos' : 'Mis pedidos'}
          </Link>
        </span>
        {user && hasPermission(user, 'organization', 'read') && (
          <span className="mr-4">
            <Link href={'/app/organization/users'}>Mi organización</Link>
          </span>
        )}
        {user && hasPermission(user, 'organizations', 'read') && (
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
