import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { getAttachments, getOrderById, getProductsByOrderId } from '@/db/orders'
import Attachment from './components/Attachment'
import ProductEdit from './components/ProductEdit'

interface PageProps {
  params: {
    orderId: string
  }
}
export default async function Page({ params }: PageProps) {
  const orderId = parseInt(params.orderId)
  
  const orderPromise = getOrderById(orderId)
  const productsPromise = getProductsByOrderId(parseInt(params.orderId))
  const attachmentsPromise = getAttachments(orderId)

  const [ order, products, attachments] = await Promise.all([ orderPromise, productsPromise, attachmentsPromise])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos</CardTitle>
        <CardDescription>Visualiza tus productos aquí.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Observaciones</TableHead>
            </TableRow>
          </TableHeader>
          <ProductEdit order={order} products={products} />
        </Table>
        <div className="py-8 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Archivos Adjuntos</h2>
          <div className="flex gap-4 min-h-10">
            {attachments.length !== 0 ? (
              attachments.map((attachment, i) => <Attachment key={i} attachment={attachment} />)
            ) : (
              <p>No hay archivos adjuntos.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
