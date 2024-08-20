import { auth } from '@/auth'
import { Button } from '@/components/ui/Button'
import { Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from '@/components/ui/Table'
import { getOrganizationDeliveryPoints } from '@/db/organizations'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CreateDeliveryPointDialog } from './components/CreateDeliveryPointDialog'
import RemoveDeliveryPointDialog from './components/RemoveDeliveryPointDialog'

export default async function Page() {
  const session = await auth()

  if (!session?.user.organizationId) return <></>

  const DeliveryPoints = await getOrganizationDeliveryPoints(session.user.organizationId)

  if (session.user.role !== 'admin') redirect('/')
  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/40">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="max-w-6xl w-full mx-auto">
          <Link href="../organization">
            <Button variant="link" className="px-0 mb-2 flex items-end">
              <ChevronLeft className="h-5" /> Volver a Organización
            </Button>
          </Link>
          <div className="grid gap-2">
            <h1 className="font-semibold text-3xl">Administra los puntos de entrega</h1>
            <p className="text-muted-foreground">Agrega o elimina los lugares de entrega de tu organización.</p>
          </div>
        </div>
        <div className="flex flex-col gap-6 max-w-6xl w-full mx-auto">
          <CreateDeliveryPointDialog organizationId={session.user.organizationId} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Código Postal</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DeliveryPoints.map((DeliveryPoint, index) => (
                <TableRow key={index}>
                  <TableCell>{DeliveryPoint.name}</TableCell>
                  <TableCell>{DeliveryPoint.address}</TableCell>
                  <TableCell>{DeliveryPoint.city}</TableCell>
                  <TableCell>{DeliveryPoint.state}</TableCell>
                  <TableCell>{DeliveryPoint.country}</TableCell>
                  <TableCell>{DeliveryPoint.postalCode}</TableCell>
                  <TableCell>
                    <RemoveDeliveryPointDialog DeliveryPointId={DeliveryPoint.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}
