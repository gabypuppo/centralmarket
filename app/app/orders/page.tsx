import { auth } from '@/auth'
import { getOrdersCentralMarket, getOrdersByOrganization, getOrdersByUser, getOrdersCSVData } from '@/db/orders'
import Link from 'next/link'
import DownloadCSV from './components/DownloadCSV'
import OrdersTable from '@/components/OrdersTable'
import { hasPermission, isCentralMarketUser } from '@/auth/authorization'

export default async function Page({ searchParams }: any) {
  const session = await auth()
  if (!session) return

  const where1 = searchParams.search1
  const status1 = searchParams.status1

  const where2 = searchParams.search2
  const status2 = searchParams.status2

  const isCentralMarket = isCentralMarketUser(session.user)

  const ordersPromise = getOrdersByUser(session.user.id!, where1, status1)
  const ordersByOrganizationPromise = isCentralMarket
    ? getOrdersCentralMarket(where2, status2)
    : getOrdersByOrganization(session.user.organizationId!, where2, status2).then((data) =>
      data.map((order) => ({ ...order, organization: null }))
    )
  const ordersCSVDataPromise = getOrdersCSVData(
    !isCentralMarket ? session.user.organizationId! : undefined
  )

  const [orders, ordersByOrganization, ordersCSVData] = await Promise.all([
    ordersPromise,
    ordersByOrganizationPromise,
    ordersCSVDataPromise
  ])

  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/40">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="max-w-6xl w-full mx-auto grid gap-2">
          <h1 className="font-semibold text-3xl">
            {isCentralMarket ? 'Solicitudes' : 'Mis solicitudes'}
          </h1>
          <p className="text-muted-foreground">
            {isCentralMarket
              ? 'Visualiza todas las solicitudes en las que eres comprador'
              : 'Visualiza todas tus solicitudes'}
          </p>
          <div className="flex content-between">
            {hasPermission(session.user, 'order', 'create') && (
              <Link
                href={'orders/new'}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-min mt-6"
              >
                CREAR SOLICITUD
              </Link>
            )}
            <DownloadCSV orders={ordersCSVData} />
          </div>
        </div>
        <div className="grid gap-6 max-w-6xl w-full mx-auto">
          <div className="overflow-x-auto grid gap-4 lg:gap-px lg:bg-gray-50">
            <OrdersTable orders={orders} id={1} />
            {hasPermission(session.user, 'orders', 'read') && (
              <div className="mt-16">
                <h1 className="font-semibold text-3xl">
                  {isCentralMarket ? 'Todas las solicitudes' : 'Solicitudes de mi organización'}
                </h1>
                <p className="text-muted-foreground mb-8">
                  {isCentralMarket
                    ? 'Administra todas las solicitudes'
                    : 'Visualiza todas las solicitudes de tu organización'}
                </p>
                <OrdersTable orders={ordersByOrganization} id={2} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
