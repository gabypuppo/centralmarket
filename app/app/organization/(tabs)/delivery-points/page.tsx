import { auth } from '@/auth'
import { Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from '@/components/ui/Table'
import { getOrganizationDeliveryPoints } from '@/db/organizations'
import { redirect } from 'next/navigation'
import { CreateDeliveryPointDialog } from './components/CreateDeliveryPointDialog'
import RemoveDeliveryPointDialog from './components/RemoveDeliveryPointDialog'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export default async function Page() {
  const session = await auth()

  if (!session?.user.organizationId) return <></>

  const DeliveryPoints = await getOrganizationDeliveryPoints(session.user.organizationId)

  if (session.user.role !== 'admin') redirect('/')
  return (
    <Card>
      <CardHeader className='gap-0'>
        <h2 className="font-semibold text-xl">Administra los puntos de entrega</h2>
        <p className="text-muted-foreground text-sm">Agrega o elimina los lugares de entrega de tu organización.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 max-w-6xl w-full mx-auto">
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
      </CardContent>
    </Card>
  )
}
