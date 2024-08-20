import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { getHistory } from '@/db/orders'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface PageProps {
  params: {
    orderId: string
  }
}
export default async function Page({ params }: PageProps) {
  const history = await getHistory(parseInt(params.orderId))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial</CardTitle>
        <CardDescription>Visualiza los cambios de tu orden.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {history.map((history, i) => (
            <li key={i} className="mb-2">
              <div className="flex justify-between">
                <span>{history.label}, por {history.modifiedBy ?? 'usuario'}</span>
                {history.date && (
                  <span>{format(history.date, 'd \'de\' MMMM \'de\' yyyy', { locale: es })}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
