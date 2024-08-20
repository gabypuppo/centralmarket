'use client'

import type { Order } from '@/db/orders'
import React, { createContext, useContext, useState } from 'react'

interface OrderContextProps {
  contextOrderData: Order;
  setContextOrderData: React.Dispatch<React.SetStateAction<Order>>;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined)

interface OrderProviderProps {
  children: React.ReactNode,
  initialState: Order
}

export const OrderProvider = ({ children, initialState }: OrderProviderProps) => {
  const [contextOrderData, setContextOrderData] = useState<Order>(initialState)

  return (
    <OrderContext.Provider value={{ contextOrderData, setContextOrderData }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrderContext = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrderContext must be used within a OrderProvider')
  }
  return context
}
