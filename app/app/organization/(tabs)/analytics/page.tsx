import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { ExpenseChart } from './components/ExpenseChart'
import { auth } from '@/auth'
import { getAnalyticsByOrganizationId, getMonthlyAnalyticsByOrganizationId, getOrganizationUsersOrderAnalytics } from '@/db/orders'
import { Separator } from '@/components/ui/Separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'

export default async function Page() {
  const session = await auth()

  if (!session?.user.organizationId) return <></>

  const currentDate = new Date()

  const weeklyAnalyticsPromise = getAnalyticsByOrganizationId(
    session.user.organizationId,
    new Date(new Date().setDate(currentDate.getDate() - 7))
  )
  const monthlyAnalyticsPromise = getAnalyticsByOrganizationId(
    session.user.organizationId,
    new Date(new Date().setMonth(currentDate.getMonth() - 1))
  )
  const yearlyAnalyticsPromise = getAnalyticsByOrganizationId(
    session.user.organizationId,
    new Date(new Date().setFullYear(currentDate.getFullYear() - 1))
  )

  const organizationAnalyticsMonthlyPromise = getMonthlyAnalyticsByOrganizationId(
    session.user.organizationId,
    new Date(new Date().setMonth(currentDate.getMonth() - 12))
  )

  const usersAnalyticsPromise = getOrganizationUsersOrderAnalytics(session.user.organizationId)

  const [
    weeklyAnalytics,
    monthlyAnalytics,
    yearlyAnalytics,
    organizationAnalyticsMonthly,
    usersAnalytics
  ] = await Promise.all([
    weeklyAnalyticsPromise,
    monthlyAnalyticsPromise,
    yearlyAnalyticsPromise,
    organizationAnalyticsMonthlyPromise,
    usersAnalyticsPromise
  ])

  return (
    <>
      <Card className="flex-1 min-w-96">
        <CardHeader>
          <h2 className="text-xl font-bold">Reporte de Gastos</h2>
        </CardHeader>
        <CardContent className="flex gap-4 w-full flex-wrap">
          <ExpenseChart
            data={organizationAnalyticsMonthly}
            className="flex-shrink-0 flex-grow-0 w-full"
          />
          <div className="flex gap-4 flex-1 flex-wrap">
            <Card className="flex flex-col flex-1 gap-2 p-3 min-h-24">
              <h3 className="text-nowrap">
                <span className="font-semibold">Gastos del Año: </span>
                {yearlyAnalytics.reduce((sum, val) => sum + val.count, 0)} Pedido(s)
              </h3>
              <Separator />
              {yearlyAnalytics.map((data, i) => {
                if (!data.currency || !data.subtotal) return
                return (
                  <span key={i} className="text-xl font-bold">
                    {data.currency}${data.subtotal ?? 0}
                  </span>
                )
              })}
            </Card>
            <Card className="flex flex-col flex-1 gap-2 p-3 min-h-24">
              <h3 className="text-nowrap">
                <span className="font-semibold">Gastos del Mes: </span>
                {monthlyAnalytics.reduce((sum, val) => sum + val.count, 0)} Pedido(s)
              </h3>
              <Separator />
              {monthlyAnalytics.map((data, i) => {
                if (!data.currency || !data.subtotal) return
                return (
                  <span key={i} className="text-xl font-bold">
                    {data.currency}${data.subtotal ?? 0}
                  </span>
                )
              })}
            </Card>
            <Card className="flex flex-col flex-1 gap-2 p-3 min-h-24">
              <h3 className="text-nowrap">
                <span className="font-semibold">Gastos de la Semana: </span>
                {weeklyAnalytics.reduce((sum, val) => sum + val.count, 0)} Pedido(s)
              </h3>
              <Separator />
              {weeklyAnalytics.map((data, i) => {
                if (!data.currency || !data.subtotal) return
                return (
                  <span key={i} className="text-xl font-bold">
                    {data.currency}${data.subtotal ?? 0}
                  </span>
                )
              })}
            </Card>
          </div>
        </CardContent>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Solic. p/Semana</TableHead>
            <TableHead>Solic. p/Mes</TableHead>
            <TableHead>Solic. p/Año</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersAnalytics.map((userAnalytics, i) => (
            <TableRow key={i}>
              <TableCell>
                <p className="font-semibold">
                  {userAnalytics.createdBy
                    ? `${userAnalytics.createdBy?.firstName} ${userAnalytics.createdBy?.lastName}`
                    : 'Usuario Desconocido'}
                </p>
                <p>{userAnalytics.createdBy?.email}</p>
              </TableCell>
              <TableCell>
                <p>{userAnalytics.weekly}</p>
              </TableCell>
              <TableCell>
                <p>{userAnalytics.monthly}</p>
              </TableCell>
              <TableCell>
                <p>{userAnalytics.yearly}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
