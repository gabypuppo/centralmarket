const getFormattedLabel = (label: OrderStatus) => {
  const labelDictionary: { [key: string]: string } = {
    PENDING: 'Solicitud creada',
    ASSIGNED_BUYER: 'Comprador asignado',
    ADDITIONAL_INFORMATION_PENDING: 'Información adicional pendiente',
    ORDER_INFORMATION_COMPLETE: 'Información de la orden completa',
    BUDGETS_IN_PROGRESS: 'Presupuestos en progreso',
    BUDGETS_TO_REVIEW: 'Presupuestos cargados',
    BUDGETS_APPROVED: 'Presupuestos aprobados',
    PURCHASE_IN_PROGRESS: 'Compra en proceso',
    PURCHASE_COMPLETED: 'Compra completada',
    SHIPPING_IN_PROGRESS: 'Envío en proceso',
    COMPLETED: 'Producto entregado',
    CANCELLED: 'Cancelado',
    REJECTED: 'Pedido en disputa',
  }
  return labelDictionary[label] ?? label
}

const getFormattedColors = (label: OrderStatus) => {
  const colorDictionary: { [key: string]: string } = {
    PENDING: 'bg-gray-700',                   // Gris oscuro para un estado neutral
    ASSIGNED_BUYER: 'bg-blue-700',            // Azul oscuro para indicar asignación
    ADDITIONAL_INFORMATION_PENDING: 'bg-orange-700', // Naranja oscuro para más información
    ORDER_INFORMATION_COMPLETE: 'bg-teal-700',     // Verde azulado oscuro para estado confirmado
    BUDGETS_IN_PROGRESS: 'bg-yellow-700',          // Amarillo oscuro para trabajo en progreso
    BUDGETS_TO_REVIEW: 'bg-amber-700',              // Ámbar oscuro para revisión
    BUDGETS_APPROVED: 'bg-green-700',              // Verde oscuro para aprobación
    PURCHASE_IN_PROGRESS: 'bg-indigo-700',        // Índigo oscuro para compra en proceso
    PURCHASE_COMPLETED: 'bg-blue-800',           // Azul oscuro para compra completada
    SHIPPING_IN_PROGRESS: 'bg-purple-700',        // Púrpura oscuro para envío en curso
    COMPLETED: 'bg-green-800',                   // Verde más oscuro para completado
    CANCELLED: 'bg-red-700',                    // Rojo oscuro para cancelación
    REJECTED: 'bg-red-800',                     // Rojo más oscuro para rechazo
  }

  return (colorDictionary[label] ?? 'bg-gray-700') + ' text-center'
}


export { getFormattedLabel, getFormattedColors }