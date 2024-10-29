import { auth } from '@/auth'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import SignOutButton from '@/components/auth/SignOutButton'
import { getExpensesByUserId } from '@/db/orders'

export default async function Page() {
  const session = await auth()
  if (!session) return

  const currentDate = new Date()
  const weeklyExpenses = await getExpensesByUserId(
    session?.user.id,
    new Date(new Date().setDate(currentDate.getDate() - 7))
  )
  const monthlyExpenses = await getExpensesByUserId(
    session?.user.id,
    new Date(new Date().setMonth(currentDate.getMonth() - 1))
  )
  const yearlyExpenses = await getExpensesByUserId(
    session?.user.id,
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
        <CardContent className="flex flex-col gap-4">
          <h3 className="flex flex-col">
            Gastos de la Semana:
            <span className="text-lg font-bold">${weeklyExpenses[0].subtotal ?? 0} ARS</span>
          </h3>

          <h3 className="flex flex-col">
            Gastos del Mes:
            <span className="text-lg font-bold">${monthlyExpenses[0].subtotal ?? 0} ARS</span>
          </h3>

          <h3 className="flex flex-col">
            Gastos del Año:
            <span className="text-lg font-bold">${yearlyExpenses[0].subtotal ?? 0} ARS</span>
          </h3>
        </CardContent>
      </Card>
    </div>
  )
}
