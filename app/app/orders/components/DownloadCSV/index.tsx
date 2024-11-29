'use client'
import { Button } from '@/components/ui/Button'
import { type getOrdersCSVData } from '@/db/orders'
import { arrayDataToCSVFile } from '@/utils'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { getFormattedLabel } from '../../utils'

interface DownloadCSVProps {
  orders: Awaited<ReturnType<typeof getOrdersCSVData>>
}

export default function DownloadCSV({ orders }: DownloadCSVProps) {
  const [fileURL, setFileURL] = useState('')
  const csvFile = useMemo(() => {
    const mappedOrders = orders.map((order) => ({
      Solicitud: order.id,
      'Título': order.title,
      Estado: order.orderStatus && getFormattedLabel(order.orderStatus),
      Cliente: order.organization?.name,
      'Destino Final': order.deliveryPoint?.name,
      Solicitante: order.creator && `${order.creator.firstName} ${order.creator.lastName}`,
      Comprador: order.buyer && `${order.buyer.firstName} ${order.buyer.lastName}`,
      Categoría: order.category?.name,
      Producto: order.product?.product,
      Unidades: order.product?.quantity,
      OC: null,
      '# Remito': order.remittance,
      '# Factura': order.invoice,
      'Fecha Creación': order.createdAt?.toLocaleDateString('es-US', { dateStyle: 'long' }),
      'Fecha Presupuesto': order.budgetedAt?.toLocaleDateString('es-US', { dateStyle: 'long' }),
      'Fecha Aprobación': order.approvedAt?.toLocaleDateString('es-US', { dateStyle: 'long' }),
      'Fecha Entrega': order.shippingDate?.toLocaleDateString('es-US', { dateStyle: 'long' }),
      'Neto 21%': null,
      'IVA 21%': null,
      'Neto 10,5%': null,
      'IVA 10,5%': null,
      TOTAL: null
    }))

    return arrayDataToCSVFile(mappedOrders, 'order_data.csv')
  }, [orders])  

  useEffect(() => {
    if (!csvFile) return

    const url = URL.createObjectURL(csvFile)
    setFileURL(url)

    return () => URL.revokeObjectURL(url)
  }, [csvFile])

  return (
    <Link
      href={fileURL}
      target="_blank"
      aria-disabled={!fileURL}
      tabIndex={!fileURL ? -1 : undefined}
      className={`ml-auto${fileURL ? '' : ' pointer-events-none'}`}
    >
      <Button disabled={!fileURL}>Descargar .CSV</Button>
    </Link>
  )
}
