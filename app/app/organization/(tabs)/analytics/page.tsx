import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { ExpenseChart } from './components/ExpenseChart'
import { auth } from '@/auth'
import { getAnalyticsByOrganizationId, getMonthlyAnalyticsByOrganizationId, getOrderCategories, getOrganizationUsersOrderAnalytics } from '@/db/orders'
import { Separator } from '@/components/ui/Separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import CategorySelect from './components/CategorySelect'

export default async function Page({ searchParams }: any) {
  const session = await auth()

  if (!session?.user.organizationId) return <></>

  const categoryId = searchParams.categoryId

  const currentDate = new Date()
  const firstOfYear = new Date(currentDate.getFullYear(), 0, 1)

  const categoriesPromise = getOrderCategories()

  const weeklyAnalyticsPromise = getAnalyticsByOrganizationId(session.user.organizationId, {
    leftEndDate: new Date(new Date().setDate(currentDate.getDate() - currentDate.getDay())),
    categoryId
  })
  const monthlyAnalyticsPromise = getAnalyticsByOrganizationId(session.user.organizationId, {
    leftEndDate: new Date(new Date(firstOfYear).setMonth(currentDate.getMonth())),
    categoryId
  })
  const yearlyAnalyticsPromise = getAnalyticsByOrganizationId(session.user.organizationId, {
    leftEndDate: firstOfYear,
    categoryId
  })

  const organizationAnalyticsMonthlyPromise = getMonthlyAnalyticsByOrganizationId(
    session.user.organizationId,
    {
      leftEndDate: new Date(new Date().setMonth(currentDate.getMonth() - 12)),
      categoryId
    }
  )

  const usersAnalyticsPromise = getOrganizationUsersOrderAnalytics(session.user.organizationId, { categoryId })

  const [
    categories,
    weeklyAnalytics,
    monthlyAnalytics,
    yearlyAnalytics,
    organizationAnalyticsMonthly,
    usersAnalytics
  ] = await Promise.all([
    categoriesPromise,
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
        <CardContent className="flex flex-col gap-4 w-full">
          <CategorySelect categories={categories} />
          <div className="flex gap-4 w-full flex-wrap">
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
          </div>
          <div className="pt-2">
            <h3 className="text-lg font-semibold">Ordenes por Usuario</h3>
            <p className="italic text-sm text-muted-foreground">Incluye ordenes no terminadas.</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Gastos p/Año</TableHead>
                <TableHead>Solic. p/Año</TableHead>
                <TableHead>Gastos p/Mes</TableHead>
                <TableHead>Solic. p/Mes</TableHead>
                <TableHead>Gastos p/Semana</TableHead>
                <TableHead>Solic. p/Semana</TableHead>
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
                    <div className="flex flex-col gap-1">
                      <p>ARS${userAnalytics.yearly.ars ?? 0}</p>
                      <p>USD${userAnalytics.yearly.usd ?? 0}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{userAnalytics.yearly.count}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <p>ARS${userAnalytics.monthly.ars ?? 0}</p>
                      <p>USD${userAnalytics.monthly.usd ?? 0}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{userAnalytics.monthly.count}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <p>ARS${userAnalytics.weekly.ars ?? 0}</p>
                      <p>USD${userAnalytics.weekly.usd ?? 0}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{userAnalytics.weekly.count}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
