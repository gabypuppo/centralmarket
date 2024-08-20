import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { getOrganizationsWithUserMetrics } from '@/db/organizations'
import Link from 'next/link'
import RemoveOrganizationAlertDialog from './components/RemoveOrganizationAlertDialog'

export default async function Page() {
  const organizations = await getOrganizationsWithUserMetrics()

  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/40">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="max-w-6xl w-full mx-auto flex justify-between">
          <div className="grid gap-2">
            <h1 className="font-semibold text-3xl">Organizaciones</h1>
            <p className="text-muted-foreground">Administra las organizaciones afiliadas</p>
          </div>
        </div>
        <div className="grid gap-6 max-w-6xl w-full mx-auto">
          <Link href="organizations/new">
            <Button>Nueva Organización</Button>
          </Link>
          <div className="border rounded-lg overflow-hidden grid gap-4 lg:gap-px lg:bg-gray-50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dominios</TableHead>
                  <TableHead>Usuarios</TableHead>
                  <TableHead>Ordenes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((organization, i) => (
                  <TableRow key={i}>
                    <TableCell>{organization.id}</TableCell>
                    <TableCell>{organization.name}</TableCell>
                    <TableCell>{organization.domains.join(', ')}</TableCell>
                    <TableCell>{organization.metrics.users}</TableCell>
                    <TableCell>{organization.metrics.orders}</TableCell>
                    <TableCell>
                      <RemoveOrganizationAlertDialog organizationId={organization.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}
