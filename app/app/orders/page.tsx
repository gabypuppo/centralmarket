import { auth } from '@/auth'
import { getOrdersCentralMarket, getOrdersByBuyer, getOrdersByOrganization, getOrdersByUser, type Order, getOrdersCSVData } from '@/db/orders'
import Link from 'next/link'
import SearchBar from '../organization/components/SearchBar'
import StatusSelect from './components/StatusSelect'
import DownloadCSV from './components/DownloadCSV'
import OrdersTable from '@/components/OrdersTable'

export default async function Page({ searchParams }: any) {
  const session = await auth()
  const id = session?.user?.id
  const organizationId = session?.user?.organizationId
  const role = session?.user?.role

  const where = searchParams.search
  const status = searchParams.status

  const isCentralMarket = organizationId === 1

  let orders: Order[] = []
  if (isCentralMarket) {
    orders = await getOrdersByBuyer(id!)
  } else {
    orders = await getOrdersByUser(id!)
  }

  let ordersByOrganization: Awaited<ReturnType<typeof getOrdersCentralMarket>>

  if (isCentralMarket) {
    ordersByOrganization = await getOrdersCentralMarket(where, status)
  } else {
    const data = await getOrdersByOrganization(organizationId!, where, status)
    ordersByOrganization = data.map((order) => ({ ...order, organization: null }))
  }

  const sortOrders = <T extends Order>(orders: T[]) =>
    orders.sort(
      (a, b) => (a.createdAt?.getTime() ?? Date.now()) - (b.createdAt?.getTime() ?? Date.now())
    )

  const ordersCSVData = await getOrdersCSVData(!isCentralMarket ? organizationId! : undefined)

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
            {!isCentralMarket && (
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
            <OrdersTable orders={orders} />
            {role === 'admin' && (
              <div className="mt-16">
                <h1 className="font-semibold text-3xl">
                  {isCentralMarket ? 'Todas las solicitudes' : 'Solicitudes de mi organización'}
                </h1>
                <p className="text-muted-foreground mb-8">
                  {isCentralMarket
                    ? 'Administra todas las solicitudes'
                    : 'Visualiza todas las solicitudes de tu organización'}
                </p>
                <div className="flex gap-2">
                  <SearchBar />
                  <StatusSelect />
                </div>
                <OrdersTable orders={ordersByOrganization} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
