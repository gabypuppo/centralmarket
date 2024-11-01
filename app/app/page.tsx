import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { getFormattedColors, getFormattedLabel } from './orders/utils'
import { Badge } from '@/components/ui/Badge'
import type { Order } from '@/db/orders'
import { getLatestOrderBuyer, getLatestOrderUser } from '@/db/orders'
import { auth } from '@/auth'
import NotFoundError from '@/components/error/NotFountError'
import { TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table, } from '@/components/ui/Table'
import { getOrdersByBuyer, getOrdersByUser } from '@/db/orders'

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

  const sortOrders = <T extends Order>(orders: T[]) =>
    orders.sort(
      (a, b) =>
        (a.shippingDate?.getTime() ?? Date.now()) -
        (b.shippingDate?.getTime() ?? Date.now()),
    )

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
            {orders.length === 0 && (
              <div className="p-4 bg-background border border-border rounded-lg">
                <p className=" text-muted-foreground">
                  No hay pedidos que esperen tu respuesta.
                </p>
              </div>
            )}
            {orders?.map((order, index) => (
              <div
                key={index}
                className="flex flex-row bg-background text-sm p-2 relative"
              >
                <div className="p-2 flex flex-col gap-1 flex-1 min-w-20">
                  <h4 className="font-semibold">#{order.id}</h4>
                  <p className="truncate">{order.notes}</p>
                </div>
                <div className="p-2 flex gap-1 flex-1 min-w-20 items-center">
                  {order?.orderStatus && (
                    <Badge className={getFormattedColors(order?.orderStatus)}>
                      {getFormattedLabel(order?.orderStatus)}
                    </Badge>
                  )}
                </div>
                <div className="p-2 flex gap-1 flex-1 min-w-20 items-center">
                  <p className="">
                    {order.shippingDate?.toLocaleDateString('es-US', { dateStyle: 'long', })}
                  </p>
                </div>
                <div className="p-2 flex gap-1">
                  <Link href={'/app/orders/' + order.id}>
                    <Button>Detalle</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-6 max-w-6xl w-full mx-auto">
          <div className="overflow-x-auto grid gap-4 mt-4 lg:gap-px lg:bg-gray-50">
            <span>
              <h2 className="text-2xl mt-8 font-bold">Tus pedidos</h2>
            </span>
            {allOrders.length === 0 ? (
              <div className="p-4 bg-background border border-border rounded-lg">
                <p className=" text-muted-foreground">
                  No hay pedidos que esperen tu respuesta.
                </p>
              </div>
            ) : (
              <Table className="border mt-4 rounded-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead>Orden</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de Entrega</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortOrders(allOrders).map((order, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex flex-col gap-1 flex-1 min-w-20">
                          <h4 className="font-semibold">#{order.id}</h4>
                          <h5 className="truncate max-w-48">
                            {order.title || (
                              <span className="text-gray-500 font-semibold">
                                (Sin titulo)
                              </span>
                            )}
                          </h5>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-1 min-w-20 items-center">
                          {order?.orderStatus && (
                            <Badge
                              className={getFormattedColors(order.orderStatus)}
                            >
                              {getFormattedLabel(order.orderStatus)}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-1 min-w-20 items-center">
                          <p className="">
                            {order.shippingDate?.toLocaleDateString('es-US', { dateStyle: 'long', })}
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
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
