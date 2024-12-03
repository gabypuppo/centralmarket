import { auth } from '@/auth'
import { Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from '@/components/ui/Table'
import { getOrganizationDeliveryPoints } from '@/db/organizations'
import { CreateDeliveryPointDialog } from './components/CreateDeliveryPointDialog'
import RemoveDeliveryPointDialog from './components/RemoveDeliveryPointDialog'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { hasPermission } from '@/auth/authorization'
import UnauthorizedError from '@/components/error/UnauthorizedError'

export default async function Page() {
  const session = await auth()
  if (!session) return

  if (!hasPermission(session.user, 'organization', 'read-delivery-points')) return <UnauthorizedError />

  const deliveryPoints = await getOrganizationDeliveryPoints(session.user.organizationId!)

  return (
    <Card>
      <CardHeader className="gap-0">
        <h2 className="font-semibold text-xl">Puntos de Entrega</h2>
        <p className="text-muted-foreground text-sm">
          Lugares de entrega de tu organización.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 max-w-6xl w-full mx-auto">
        {hasPermission(session.user, 'organization', 'create-delivery-points') && (
          <CreateDeliveryPointDialog organizationId={session.user.organizationId!} />
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Código Postal</TableHead>
              {hasPermission(session.user, 'organization', 'delete-delivery-points') && (
                <TableHead>Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveryPoints.map((deliveryPoint, index) => (
              <TableRow key={index}>
                <TableCell>{deliveryPoint.name}</TableCell>
                <TableCell>{deliveryPoint.address}</TableCell>
                <TableCell>{deliveryPoint.city}</TableCell>
                <TableCell>{deliveryPoint.state}</TableCell>
                <TableCell>{deliveryPoint.country}</TableCell>
                <TableCell>{deliveryPoint.postalCode}</TableCell>
                {hasPermission(session.user, 'organization', 'delete-delivery-points') && (
                  <TableCell>
                    <RemoveDeliveryPointDialog DeliveryPointId={deliveryPoint.id} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
