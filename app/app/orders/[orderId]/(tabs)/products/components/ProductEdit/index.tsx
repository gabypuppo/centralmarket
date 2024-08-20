'use client'

import React, { useState } from 'react'
import { TableBody, TableCell, TableRow } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Order, OrderProduct } from '@/db/orders'
import { OrderStatusEnum } from '@/utils/enums'
import { sendMailProductUpdatedAction } from '@/utils/actions'


interface OrderTableProps {
  order: Order;
  products: OrderProduct[];
}
const ProductEdit: React.FC<OrderTableProps> = ({ order, products: _products }) => {
  const [products, setProducts] = useState<OrderProduct[]>(_products)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedProduct, setEditedProduct] = useState<OrderProduct | null>(null)
  
  const orderStatus = order.orderStatus
  const orderStatusEnum = orderStatus ? OrderStatusEnum[orderStatus] : null
  if (orderStatusEnum && orderStatusEnum >= 4) return (
    // to do - sumar un mensaje que en ese estado no se pueden editar los productos
    <TableBody>
      {products.map((product) => (
        <TableRow key={product.id}>
          <TableCell>{product.product}</TableCell>
          <TableCell>
            {product.estimatedCost}$ ({product.estimatedCostCurrency})
          </TableCell>
          <TableCell>
            {product.quantity} {product.quantityUnit}
          </TableCell>
          <TableCell>{product.productNotes}</TableCell> 
        </TableRow>
      ))}
    </TableBody>
  )

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditedProduct({ ...products[index] })
  }

  const handleSave = async (index: number) => {
    if (editedProduct) {
      try {
        const response = await fetch('/api/orders/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify({ ...editedProduct, }),
        })

        if (!response.ok) {
          throw new Error('Failed to update product')
        }

        if (!order.id || !order.createdBy || !order.assignedBuyerId) return
        sendMailProductUpdatedAction(order.id, order.createdBy, order.assignedBuyerId)

        const updatedProduct = await response.json()
        const newProducts = [...products]
        newProducts[index] = updatedProduct
        setProducts(newProducts)
        setEditingIndex(null)
        setEditedProduct(null)
      } catch (error) {
        console.error('Error updating product:', error)
        // Handle error (e.g., show error message to user)
      }
    }
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setEditedProduct(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof OrderProduct) => {
    if (editedProduct) {
      setEditedProduct({ ...editedProduct, [field]: e.target.value })
    }
  }

  return (
    <TableBody>
      {products.map((product, index) => (
        <TableRow key={product.id}>
          {editingIndex === index && editedProduct ? (
            <>
              <TableCell>
                <Input
                  value={editedProduct.product ?? ''}
                  onChange={(e) => handleChange(e, 'product')}
                />
              </TableCell>
              <TableCell>
                <Input
                  value={editedProduct.estimatedCost ?? ''}
                  onChange={(e) => handleChange(e, 'estimatedCost')}
                  type="number"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={editedProduct.quantity ?? ''}
                  onChange={(e) => handleChange(e, 'quantity')}
                  type="number"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={editedProduct.productNotes ?? ''}
                  onChange={(e) => handleChange(e, 'productNotes')}
                />
              </TableCell>
              <TableCell>
                <Button className='mr-2 mb-2 lg:mb-0' onClick={() => handleSave(index)}>Save</Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </TableCell>
            </>
          ) : (
            <>
              <TableCell>{product.product}</TableCell>
              <TableCell>
                {product.estimatedCost}$ ({product.estimatedCostCurrency})
              </TableCell>
              <TableCell>
                {product.quantity}, unidad {product.quantityUnit}
              </TableCell>
              <TableCell>{product.productNotes}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(index)}>Edit</Button>
              </TableCell>
            </>
          )}
        </TableRow>
      ))}
    </TableBody>
  )
}

export default ProductEdit