import { auth } from '@/auth'
import { redirect, RedirectType } from 'next/navigation'

interface PageProps {
  params: {
    orderId: string
  }
}
export default async function Page({ params }: PageProps) {
  const session = await auth()
  
  if (session?.user.organizationId === 1) {
    redirect(`${params.orderId}/actions`, RedirectType.replace)
  } else{
    redirect(`${params.orderId}/details`, RedirectType.replace)
  }
}
