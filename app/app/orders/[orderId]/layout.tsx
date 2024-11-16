import { Button } from '@/components/ui/Button'
import { OrderProvider } from '@/contexts/OrderContext'
import { ChevronLeft } from 'lucide-react'
import { getOrderById } from '@/db/orders'
import { auth } from '@/auth'
import NotFoundError from '@/components/error/NotFountError'
import UnauthorizedError from '@/components/error/UnauthorizedError'
import OrderStatusSteps from './components/OrderStatusSteps'
import Link from 'next/link'
import CancelOrderButton from './components/CancelOrderButton'
import IssueWithMyOrderButton from './components/IssueWithMyOrderButton'
import TabsNav from '@/app/components/layout/TabsNav'

interface LayoutProps {
  params: {
    orderId: string
  }
  children: React.ReactNode
}
export default async function Layout({ params, children }: LayoutProps) {
  const session = await auth()

  if (!params.orderId || isNaN(Number(params.orderId))) {
    return (
      <NotFoundError>
        <p className="text-center text-muted-foreground">
          El ID de la solicitud que ingresaste no es valido. Por favor ingresa uno valido.
        </p>
        <Button variant={'default'} className="mx-auto mt-4">
          <Link href="/app/orders">Volver a solicitudes</Link>
        </Button>
      </NotFoundError>
    )
  }

  const order = await getOrderById(parseInt(params.orderId))

  if (!order) {
    return (
      <NotFoundError>
        <p className="text-center text-muted-foreground">La solicitud ingresada no existe.</p>
        <Button variant={'default'} className="mx-auto mt-4">
          <Link href="/app/orders">Volver a solicitudes</Link>
        </Button>
      </NotFoundError>
    )
  }

  if (
    session?.user.organizationId !== 1 &&
    (session?.user.organizationId !== order.organizationId ||
      (session?.user.id !== order.createdBy &&
        order.createdBy !== null &&
        session.user.role !== 'admin'))
  ) {
    return (
      <UnauthorizedError>
        <Button variant={'default'} className="mx-auto mt-4">
          <Link href="/app/orders">Volver a solicitudes</Link>
        </Button>
      </UnauthorizedError>
    )
  }

  return (
    <OrderProvider initialState={order}>
      <div className="flex flex-col w-full min-h-screen bg-muted/40">
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
          <div className="max-w-6xl w-full mx-auto flex justify-between">
            <Link href={'/app/orders'}>
              <Button variant="link" className="px-0 mb-2 flex items-end">
                <ChevronLeft className="h-5" />
                Volver a solicitudes
              </Button>
            </Link>
            <CancelOrderButton />
            <IssueWithMyOrderButton />
          </div>
          <span className="text-lg font-bold max-w-6xl w-full mx-auto">
            Pedido #{order.id}
            {' - '}
            {order.title ? (
              `${order.title}`
            ) : (
              <span className="text-gray-500 font-semibold">(Sin título)</span>
            )}
          </span>
          <div className="flex gap-6 max-w-6xl w-full mx-auto justify-center md:justify-normal">
            <div className="flex flex-row justify-evenly ">
              <OrderStatusSteps order={order} />
            </div>
          </div>
          <div className="flex flex-col gap-6 max-w-6xl w-full mx-auto">
            <TabsNav
              tabs={(session.user.organizationId === 1
                ? [{ label: 'Acciones', href: 'actions' }]
                : []
              ).concat([
                { label: 'Detalles', href: 'details' },
                { label: 'Productos', href: 'products' },
                { label: 'Presupuestos', href: 'budgets' },
                { label: 'Archivos', href: 'files' },
                { label: 'Preguntas', href: 'questions' },
                { label: 'Historia', href: 'history' }
              ])}
            />
            {children}
          </div>
        </main>
      </div>
    </OrderProvider>
  )
}
