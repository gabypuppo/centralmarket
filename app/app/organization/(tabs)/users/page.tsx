import { MailIcon } from '@/assets/icons'
import { auth } from '@/auth'
import SearchBar from '@/components/SearchBar'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { getOrganizationMembers } from '@/db/organizations'
import { capitalizeFirstLetterOfString } from '@/utils'
import RemoveUserAlertDialog from './components/RemoveUserAlertDialog'
import UnauthorizedError from '@/components/error/UnauthorizedError'
import { hasPermission } from '@/auth/authorization'

export default async function Page({ searchParams }: any) {
  const session = await auth()
  if (!session) return

  if (!hasPermission(session.user, 'organization', 'read-users')) return <UnauthorizedError />

  const where = searchParams.search ?? ''
  
  const organizationMembers = await getOrganizationMembers(session.user.organizationId!, where)

  return (
    <>
      <SearchBar />
      <div className="border rounded-lg overflow-hidden grid gap-4 lg:gap-px lg:bg-gray-50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Verificado</TableHead>
              {hasPermission(session.user, 'organization', 'delete-users') && (
                <TableHead>Acciones</TableHead>
              )}
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
                {hasPermission(session.user, 'organization', 'delete-users') && (
                  <TableCell>
                    <div className="p-2 grid gap-1 flex-1">
                      <RemoveUserAlertDialog userId={member.id} />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
