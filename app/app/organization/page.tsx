import { MailIcon } from 'assets/icons'
import { auth } from '@/auth'
import { getOrganizationMembers } from '@/db/organizations'

import { Badge } from '@/components/ui/Badge'
import { capitalizeFirstLetterOfString } from '@/utils'

import RemoveUserAlertDialog from './components/RemoveUserAlertDialog'
import SearchBar from './components/SearchBar'
import { Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from '@/components/ui/Table'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function Page({ searchParams }: any) {
  const where = searchParams.search ?? ''
  const session = await auth()

  if (!session?.user.organizationId) return <></>

  const organizationMembers = await getOrganizationMembers(session.user.organizationId, where)

  if (!organizationMembers) return <></>

  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/40">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="max-w-6xl w-full mx-auto flex justify-between">
          <div className="grid gap-2">
            <h1 className="font-semibold text-3xl">Organización</h1>
            <p className="text-muted-foreground">Administra los miembros de tu organización</p>
          </div>
          {session.user.role === 'admin' && (
            <Link href="organization/deliveryPoints">
              <Button>Puntos de Entrega</Button>
            </Link>
          )}
        </div>
        <div className="grid gap-6 max-w-6xl w-full mx-auto">
          <SearchBar />
          <div className="border rounded-lg overflow-hidden grid gap-4 lg:gap-px lg:bg-gray-50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Verificado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizationMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{member.firstName}</div>
                      <div className="text-muted-foreground">
                        {member.role === 'admin' ? (
                          <Badge variant="outline" className="bg-background">
                            {capitalizeFirstLetterOfString(member.role)}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-background">
                            {capitalizeFirstLetterOfString(member.role ?? 'user')}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MailIcon className="w-4 h-4" />
                        {member.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">
                          {member.isVerified ? 'Verificado' : 'No Verificado'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="p-2 grid gap-1 flex-1">
                        {session.user.role === 'admin' && (
                          <RemoveUserAlertDialog userId={member.id} />
                        )}
                      </div>
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
