'use client'
import React, { useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table'
import { Badge } from '../ui/Badge'
import { Order } from '@/db/orders'
import { Button } from '@/components/ui/Button'
import { OrderStatusEnum } from '@/utils/enums'
import { getFormattedColors, getFormattedLabel } from '@/app/app/orders/utils'
import { SortAscIcon, SortDescIcon } from 'lucide-react'
import Link from 'next/link'

interface Props {
  orders: Order[]
}

export default function OrdersTable({ orders }: Props) {
  const [sortedBy, setSortedBy] =
    useState<keyof Pick<Order, 'id' | 'orderStatus' | 'createdAt' | 'shippingDate'>>('id')
  const [isAsc, setIsAsc] = useState(false)

  const sortedOrders = useMemo(() => {
    const res = orders.sort((a, b) => {
      if (!a || !b) return Number.MIN_VALUE
      if (sortedBy === 'orderStatus') {
        return OrderStatusEnum[b[sortedBy] ?? 'PENDING'] - OrderStatusEnum[a[sortedBy] ?? 'PENDING']
      }
      if (sortedBy === 'createdAt' || sortedBy === 'shippingDate') {
        return new Date(b[sortedBy] ?? 0).getTime() - new Date(a[sortedBy] ?? 0).getTime()
      }
      return b[sortedBy] - a[sortedBy]
    })

    return isAsc ? res.reverse() : res
  }, [orders, sortedBy, isAsc])

  return (
    <Table className="border mt-4 rounded-lg">
      <TableHeader>
        <TableRow>
          <TableHeadExtra
            title="Orden"
            value="id"
            sortedBy={sortedBy}
            isAsc={isAsc}
            setSortedBy={setSortedBy}
            setIsAsc={setIsAsc}
          />
          <TableHeadExtra
            title="Estado"
            value="orderStatus"
            sortedBy={sortedBy}
            isAsc={isAsc}
            setSortedBy={setSortedBy}
            setIsAsc={setIsAsc}
          />
          <TableHeadExtra
            title="Fecha de Entrega"
            value="shippingDate"
            sortedBy={sortedBy}
            isAsc={isAsc}
            setSortedBy={setSortedBy}
            setIsAsc={setIsAsc}
          />
          <TableHeadExtra
            title="Fecha de Creación"
            value="createdAt"
            sortedBy={sortedBy}
            isAsc={isAsc}
            setSortedBy={setSortedBy}
            setIsAsc={setIsAsc}
          />
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!sortedOrders.length && (
          <div className="p-4 bg-background border border-border rounded-lg">
            <p className=" text-muted-foreground">No hay pedidos.</p>
          </div>
        )}
        {sortedOrders.map((order, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex flex-col gap-1 flex-1 min-w-20">
                <h4 className="font-semibold">#{order.id}</h4>
                <h5 className="truncate max-w-48">
                  {order.title || <span className="text-gray-500 font-semibold">(Sin titulo)</span>}
                </h5>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 flex-1 min-w-20 items-center">
                {order?.orderStatus && (
                  <Badge className={getFormattedColors(order.orderStatus)}>
                    {getFormattedLabel(order.orderStatus)}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 flex-1 min-w-20 items-center">
                <p>{order.shippingDate?.toLocaleDateString('es-US', { dateStyle: 'long' })}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 flex-1 min-w-20 items-center">
                <p>{order.createdAt?.toLocaleDateString('es-US', { dateStyle: 'long' })}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Link href={'/app/orders/' + order.id}>
                  <Button>Detalle</Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

interface TableHeadExtraProps {
  title: string
  value: keyof Pick<Order, 'id' | 'orderStatus' | 'createdAt' | 'shippingDate'>
  sortedBy: keyof Pick<Order, 'id' | 'orderStatus' | 'createdAt' | 'shippingDate'>
  isAsc: boolean
  setSortedBy: (
    value: keyof Pick<Order, 'id' | 'orderStatus' | 'createdAt' | 'shippingDate'>
  ) => void
  setIsAsc: (value: boolean) => void
}

function TableHeadExtra({
  title,
  value,
  sortedBy,
  isAsc,
  setSortedBy,
  setIsAsc
}: TableHeadExtraProps) {
  return (
    <TableHead>
      <button
        className={`flex justify-between items-center gap-1 ${sortedBy === value ? 'font-semibold text-slate-900' : 'font-normal'}`}
        onClick={() => {
          setSortedBy(value)
          setIsAsc(sortedBy === value ? !isAsc : false)
        }}
      >
        {title}
        {sortedBy === value && isAsc ? <SortAscIcon width={16} /> : <SortDescIcon width={16} />}
      </button>
    </TableHead>
  )
}
