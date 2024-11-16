import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { ExpenseChart } from './components/ExpenseChart'
import { auth } from '@/auth'
import { getAnalyticsByOrganizationId, getMonthlyAnalyticsByOrganizationId } from '@/db/orders'

export default async function Page() {
  const session = await auth()

  if (!session?.user.organizationId) return <></>

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
    <Card className="flex-1 min-w-96">
      <CardHeader>
        <h2 className="text-xl font-bold">Reporte de Gastos</h2>
      </CardHeader>
      <CardContent className="flex gap-4 w-full flex-wrap">
        <ExpenseChart
          data={organizationAnalyticsMonthly}
          className="flex-shrink-0 flex-grow-0 w-full"
        />
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
  )
}
