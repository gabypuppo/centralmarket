import { auth } from '@/auth'
import NewOrganizationForm from './components/NewOrganizationForm'
import { hasPermission } from '@/auth/authorization'
import UnauthorizedError from '@/components/error/UnauthorizedError'

export default async function Page() {
  const session = await auth()
  if (!session) return

  if (!hasPermission(session.user, 'organization', 'create')) return <UnauthorizedError />

  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/40">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="max-w-6xl w-full mx-auto grid gap-2">
          <h1 className="font-semibold text-3xl">Crear Nueva Organización</h1>
        </div>
        <div className="grid gap-6 max-w-6xl w-full mx-auto">
          <NewOrganizationForm />
        </div>
      </main>
    </div>
  )
}
