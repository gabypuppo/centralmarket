import { auth } from '@/auth'
import { hasPermission } from '@/auth/authorization'
import { redirect, RedirectType } from 'next/navigation'

interface PageProps {
  params: {
    orderId: string
  }
}
export default async function Page({ params }: PageProps) {
  const session = await auth()
  if (!session) return
  
  if (hasPermission(session.user, 'order', 'handle')) {
    redirect(`${params.orderId}/actions`, RedirectType.replace)
  } else{
    redirect(`${params.orderId}/details`, RedirectType.replace)
  }
}
