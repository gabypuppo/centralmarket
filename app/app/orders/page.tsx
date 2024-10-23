import { auth } from '@/auth'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getOrdersCentralMarket, getOrdersByBuyer, getOrdersByOrganization, getOrdersByUser, type Order, getOrdersCSVData } from '@/db/orders'
import Link from 'next/link'
import { getFormattedColors, getFormattedLabel } from './utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import SearchBar from '../organization/components/SearchBar'
import StatusSelect from './components/StatusSelect'
import DownloadCSV from './components/DownloadCSV'

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
            {orders.length === 0 && (
              <div className="flex flex-col bg-background text-sm p-2">
                <div className="p-2 grid gap-1 flex-1">
                  <div className="font-medium">No se encontraron ordenes</div>
                </div>
              </div>
            )}
            <Table className="border rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Entrega</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortOrders(orders).map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex flex-col gap-1 flex-1 min-w-20">
                        <h4 className="font-semibold">#{order.id}</h4>
                        <h5 className="truncate max-w-48">{order.title || <span className='text-gray-500 font-semibold'>(Sin titulo)</span>}</h5>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-1 min-w-20 items-center">
                        {order?.orderStatus && (
                          <Badge className={getFormattedColors(order.orderStatus)}>
                            {getFormattedLabel(order.orderStatus)}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-1 min-w-20 items-center">
                        <p className="">
                          {order.shippingDate?.toLocaleDateString('es-US', { dateStyle: 'long' })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-1 min-w-20 items-center">
                        <p className="">
                          {order.createdAt?.toLocaleDateString('es-US', { dateStyle: 'long' })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link href={'/app/orders/' + order.id}>
                          <Button>Detalle</Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                <Table className="border rounded-lg mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Orden</TableHead>
                      {isCentralMarket && <TableHead>Organización</TableHead>}
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de Entrega</TableHead>
                      <TableHead>Fecha de Creación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortOrders(ordersByOrganization).map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex flex-col gap-1 flex-1 min-w-20 max-w-32">
                            <h4 className="font-semibold">#{order.id}</h4>
                            <h5 className="truncate">{order.title || <span className='text-gray-500 font-semibold'>(Sin título)</span>}</h5>
                          </div>
                        </TableCell>
                        {isCentralMarket && (
                          <TableCell>
                            <p>{order.organization?.name}</p>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex gap-1 flex-1 min-w-20 items-center">
                            {order?.orderStatus && (
                              <Badge className={getFormattedColors(order.orderStatus)}>
                                {getFormattedLabel(order.orderStatus)}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-1 min-w-20 items-center">
                            <p className="">
                              {order.shippingDate?.toLocaleDateString('es-US', { dateStyle: 'long' })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-1 min-w-20 items-center">
                            <p className="">
                              {order.createdAt?.toLocaleDateString('es-US', { dateStyle: 'long' })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Link href={'/app/orders/' + order.id}>
                              <Button>Detalle</Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
