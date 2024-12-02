import { auth } from '@/auth'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import SignOutButton from '@/components/auth/SignOutButton'
import { getAnalyticsByUserId } from '@/db/orders'
import { Separator } from '@/components/ui/Separator'

export default async function Page() {
  const session = await auth()
  if (!session) return

  const currentDate = new Date()
  const weeklyAnalytics = await getAnalyticsByUserId(
    session.user.id,
    new Date(new Date().setDate(currentDate.getDate() - 7))
  )
  const monthlyAnalytics = await getAnalyticsByUserId(
    session.user.id,
    new Date(new Date().setMonth(currentDate.getMonth() - 1))
  )
  const yearlyAnalytics = await getAnalyticsByUserId(
    session.user.id,
    new Date(new Date().setFullYear(currentDate.getFullYear() - 1))
  )

  return (
    <div className="mt-10 flex justify-center gap-4 mx-12 flex-wrap">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">
                    {session?.user?.firstName} {session?.user?.lastName}
                  </h2>
                  <Badge variant="secondary" className="h-6 px-2 rounded-full">
                    {session?.user?.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">First Name</div>
              <div>{session?.user?.firstName}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Last Name</div>
              <div>{session?.user?.lastName}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Role</div>
            <div>{session?.user?.role}</div>
          </div>
          <SignOutButton />
        </CardContent>
      </Card>
      <Card className="flex-1 min-w-96">
        <CardHeader>
          <h2 className="text-xl font-bold">Reporte de Gastos</h2>
        </CardHeader>
        <CardContent className="flex gap-4 w-fit flex-wrap">
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
        </CardContent>
      </Card>
    </div>
  )
}
