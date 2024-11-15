import { MailIcon } from 'assets/icons'
import { auth } from '@/auth'
import { getOrganizationMembers } from '@/db/organizations'

import { Badge } from '@/components/ui/Badge'
import { capitalizeFirstLetterOfString } from '@/utils'

import RemoveUserAlertDialog from './components/RemoveUserAlertDialog'
import SearchBar from '../../../components/SearchBar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { getAnalyticsByOrganizationId, getMonthlyAnalyticsByOrganizationId } from '@/db/orders'
import { ExpenseChart } from './components/ExpenseChart'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export default async function Page({ searchParams }: any) {
  const where = searchParams.search ?? ''
  const session = await auth()

  if (!session?.user.organizationId) return <></>

  const organizationMembers = await getOrganizationMembers(session.user.organizationId, where)

  if (!organizationMembers) return <></>

  const currentDate = new Date()

  const weeklyAnalytics = await getAnalyticsByOrganizationId(
    session.user.organizationId,
    new Date(new Date().setDate(currentDate.getDate() - 7))
  )
  const monthlyAnalytics = await getAnalyticsByOrganizationId(
    session.user.organizationId,
    new Date(new Date().setMonth(currentDate.getMonth() - 1))
  )
  const yearlyAnalytics = await getAnalyticsByOrganizationId(
    session.user.organizationId,
    new Date(new Date().setFullYear(currentDate.getFullYear() - 1))
  )

  const organizationAnalyticsMonthly = await getMonthlyAnalyticsByOrganizationId(
    session.user.organizationId,
    new Date(new Date().setMonth(currentDate.getMonth() - 12))
  )

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
          <Card className="flex-1 min-w-96">
            <CardHeader>
              <h2 className="text-xl font-bold">Reporte de Gastos</h2>
            </CardHeader>
            <CardContent className="flex gap-4 w-full flex-wrap">
              <ExpenseChart data={organizationAnalyticsMonthly} className="flex-shrink-0 flex-grow-0 w-full" />
              <div className="flex flex-col gap-4 flex-shrink-0 w-fit flex-wrap">
                <Card className="flex flex-col gap-2 p-3">
                  <h3>
                    <span className="font-semibold">Gastos del Año: </span>
                    {yearlyAnalytics.reduce((sum, val) => sum + val.count, 0)} Pedido(s)
                  </h3>
                  {yearlyAnalytics.map((data, i) => {
                    if (!data.currency || !data.subtotal) return
                    return (
                      <span key={i} className="text-lg font-bold">
                        {data.currency}${data.subtotal ?? 0}
                      </span>
                    )
                  })}
                </Card>
                <Card className="flex flex-col gap-2 p-3">
                  <h3>
                    <span className="font-semibold">Gastos del Mes: </span>
                    {monthlyAnalytics.reduce((sum, val) => sum + val.count, 0)} Pedido(s)
                  </h3>
                  {monthlyAnalytics.map((data, i) => {
                    if (!data.currency || !data.subtotal) return
                    return (
                      <span key={i} className="text-lg font-bold">
                        {data.currency}${data.subtotal ?? 0}
                      </span>
                    )
                  })}
                </Card>
                <Card className="flex flex-col flex-shrink-0 gap-2 p-3">
                  <h3>
                    <span className="font-semibold">Gastos de la Semana: </span>
                    {weeklyAnalytics.reduce((sum, val) => sum + val.count, 0)} Pedido(s)
                  </h3>
                  {weeklyAnalytics.map((data, i) => {
                    if (!data.currency || !data.subtotal) return
                    return (
                      <span key={i} className="text-lg font-bold">
                        {data.currency}${data.subtotal ?? 0}
                      </span>
                    )
                  })}
                </Card>
              </div>
            </CardContent>
          </Card>
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
