import TabsNav from '@/app/components/layout/TabsNav'
import { auth } from '@/auth'
import UnauthorizedError from '@/components/error/UnauthorizedError'
import { type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
export default async function Layout({ children }: Props) {
  const session = await auth()
  
  if (session?.user.role !== 'admin') return <UnauthorizedError/>

  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/40">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="max-w-6xl w-full mx-auto flex justify-between">
          <div className="grid gap-2">
            <h1 className="font-semibold text-3xl">Organización</h1>
            <p className="text-muted-foreground">Administra el total de tu organización.</p>
          </div>
        </div>
        <div className="grid gap-6 max-w-6xl w-full mx-auto">
          <TabsNav
            tabs={[
              { label: 'Usuarios', href: 'users' },
              { label: 'Puntos de Entrega', href: 'delivery-points' },
              { label: 'Estadísticas', href: 'analytics' }
            ]}
          />
          {children}
        </div>
      </main>
    </div>
  )
}
