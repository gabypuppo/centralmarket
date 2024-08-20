import { auth } from '@/auth'
import UnauthorizedError from '@/components/error/UnauthorizedError'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || session.user.organizationId !== 1 || session.user.role !== 'admin') {
    return <UnauthorizedError />
  }

  return <>{children}</>
}
