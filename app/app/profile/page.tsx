import { auth } from '@/auth'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import SignOutButton from '@/components/auth/SignOutButton'

export default async function Page() {
  const session = await auth()

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold">{session?.user?.firstName} {session?.user?.lastName}</div>
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
  )
}
