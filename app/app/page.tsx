import Link from 'next/link'
import type { Order } from '@/db/orders'
import { getLatestOrderBuyer, getLatestOrderUser } from '@/db/orders'
import { auth } from '@/auth'
import NotFoundError from '@/components/error/NotFountError'
import { getOrdersByBuyer, getOrdersByUser } from '@/db/orders'
import OrdersTable from '@/components/OrdersTable'

export default async function Page() {
  const session = await auth()
  const id = session?.user?.id
  const organizationId = session?.user?.organizationId
  const isCentralMarket = organizationId === 1

  if (!id)
    return (
      <NotFoundError>
        <p className="text-center text-muted-foreground">
          Error al traer los datos del usuario.
        </p>
      </NotFoundError>
    )

  if (!organizationId)
    return (
      <NotFoundError>
        <p className="text-center text-muted-foreground">
          Este usuario no esta asignado a ninguna organización.
        </p>
      </NotFoundError>
    )

  let orders: Order[] = []
  if (organizationId === 1) {
    orders = await getLatestOrderBuyer(id!)
  } else {
    orders = await getLatestOrderUser(id!)
  }

  let allOrders: Order[] = []
  if (isCentralMarket) {
    allOrders = await getOrdersByBuyer(id!)
  } else {
    allOrders = await getOrdersByUser(id!)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-muted/40 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid gap-8">
          {!isCentralMarket && (
            <Link
              href={'app/orders/new'}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-min mt-6"
            >
              CREAR SOLICITUD
            </Link>
          )}
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Pedidos que esperan tu respuesta
              </h2>
              <Link
                href="/app/orders"
                className="text-sm font-medium text-primary hover:underline"
                prefetch={false}
              >
                Ver todas las ordenes
              </Link>
            </div>
            {orders.length === 0 ? (
              <div className="p-4 bg-background border border-border rounded-lg">
                <p className="text-muted-foreground">No hay pedidos que esperen tu respuesta.</p>
              </div>
            ) : (
              <OrdersTable orders={orders} />
            )}
          </div>
        </div>
        <div className="grid gap-6 max-w-6xl w-full mx-auto">
          <div className="overflow-x-auto grid gap-4 mt-4 lg:gap-px lg:bg-gray-50">
            <span>
              <h2 className="text-2xl mt-8 font-bold">Tus pedidos</h2>
            </span>
            <OrdersTable orders={allOrders} />
          </div>
        </div>
      </main>
    </div>
  )
}
