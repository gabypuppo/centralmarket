import { getOrganizationDeliveryPoints } from '@/db/organizations'
import OrderForm from './components/OrderForm'
import { auth } from '@/auth'
import { hasPermission } from '@/auth/authorization'
import UnauthorizedError from '@/components/error/UnauthorizedError'

export default async function Page() {
  const session = await auth()
  if (!session) return

  const deliveryPoints = await getOrganizationDeliveryPoints(session.user.organizationId!)

  if (!hasPermission(session.user, 'order', 'create')) return <UnauthorizedError />

  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/40">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="max-w-6xl w-full mx-auto grid gap-2">
          <h1 className="font-semibold text-3xl">Crear Solicitud</h1>
        </div>
        <div className="grid gap-6 max-w-6xl w-full mx-auto">
          <OrderForm deliveryPoints={deliveryPoints} />
        </div>
      </main>
    </div>
  )
}
