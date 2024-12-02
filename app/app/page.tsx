import Link from 'next/link'
import { getLatestOrdersByUser } from '@/db/orders'
import { auth } from '@/auth'
import { getOrdersByUser } from '@/db/orders'
import OrdersTable from '@/components/OrdersTable'
import { hasPermission } from '@/auth/authorization'

export default async function Page({ searchParams }: any) {
  const session = await auth()
  if (!session) return

  const where1 = searchParams.search1
  const status1 = searchParams.status1

  const where2 = searchParams.search2
  const status2 = searchParams.status2
  
  const ordersPromise = getLatestOrdersByUser(session.user.id, where1, status1)
  const allOrdersPromise = getOrdersByUser(session.user.id!, where2, status2)

  const [orders, allOrders] = await Promise.all([ordersPromise, allOrdersPromise])

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-muted/40 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid gap-8">
          {hasPermission(session.user, 'order', 'create') && (
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
              <OrdersTable orders={orders} id={1} />
            )}
          </div>
        </div>
        <div className="grid gap-6 max-w-6xl w-full mx-auto">
          <div className="overflow-x-auto grid gap-4 mt-4 lg:gap-px lg:bg-gray-50">
            <span>
              <h2 className="text-2xl mt-8 font-bold">Tus pedidos</h2>
            </span>
            <OrdersTable orders={allOrders} id={2} />
          </div>
        </div>
      </main>
    </div>
  )
}
