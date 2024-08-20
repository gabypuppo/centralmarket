import { UserProvider } from '@/contexts/UserContext'
import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import { GeistSans } from 'geist/font/sans'

const title = 'Central Market App'
const description =
  'En Central Market nos encargamos de reducir los gastos en compras, los tiempos de entrega de los pedidos y gestionamos los proveedores de nuestros clientes'

export const metadata = {
  title,
  description,
  twitter: {
    card: 'summary_large_image',
    title,
    description
  },
  metadataBase: new URL('https://nextjs-postgres-auth.vercel.app')
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <UserProvider>
        <SpeedInsights />
        <body className={GeistSans.variable}>
          {children}
          <Analytics />  
        </body>
      </UserProvider>
    </html>
  )
}
