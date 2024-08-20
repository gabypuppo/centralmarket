import type { Order } from '@/db/orders'

interface OrderStatusStepProps {
  order: Order
}
function OrderStatusStep({ order }: OrderStatusStepProps) {
  const orderStatus = order.orderStatus

  const steps: Steps[] = [
    {
      label: 'Creación de Solicitud',
      value: 'PENDING',
      isVisibleOnSteps: true,
      visibleId: 1
    },
    {
      label: 'Comprador asignado',
      value: 'ASSIGNED_BUYER',
      isVisibleOnSteps: true,
      visibleId: 2
    },
    {
      label: 'Información adicional pendiente',
      value: 'ADDITIONAL_INFORMATION_PENDING'
    },
    {
      label: 'Información de la orden completa',
      value: 'ORDER_INFORMATION_COMPLETE'
    },
    { label: 'Presupuestos en progreso', value: 'BUDGETS_IN_PROGRESS' },
    {
      label: 'Presupuestos cargados', value: 'BUDGETS_TO_REVIEW', isVisibleOnSteps: true, visibleId: 3
    },
    {
      label: 'Presupuestos aprobados',
      value: 'BUDGETS_APPROVED',

    },
    {
      label: 'Compra en proceso',
      value: 'PURCHASE_IN_PROGRESS',
      isVisibleOnSteps: true,
      visibleId: 4
    },
    { label: 'Compra completada', value: 'PURCHASE_COMPLETED' },
    {
      label: 'Envío en proceso',
      value: 'SHIPPING_IN_PROGRESS',
      isVisibleOnSteps: true,
      visibleId: 5
    },
    {
      label: 'Producto entregado',
      value: 'COMPLETED',
      isVisibleOnSteps: true,
      visibleId: 6
    },
    { label: 'Cancelado', value: 'CANCELLED' },
    { label: 'Rechazado', value: 'REJECTED' }
  ]

  const currentStepIndex = steps.findIndex((step) => step.value === orderStatus)

  steps.forEach((step, index) => {
    if (index === 0) {
      step.completed = true
    } else if (index <= currentStepIndex) {
      step.completed = true
    } else {
      step.completed = false
    }
  })

  if (order.orderStatus === 'CANCELLED') {
    return (
      <div>
        <h1>Esta orden ha sido cancelada.</h1>
      </div>
    )
  }

  return (
    <div className="flex md:flex-row flex-col justify-evenly ">
      {steps.map(
        (step, index) =>
          step.isVisibleOnSteps && (
            <div key={index} className="flex flex-col md:flex-row items-center justify-center">
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    step.completed ? 'bg-green-400 text-white' : 'bg-gray-300 text-black'
                  }`}
                >
                  {step.completed ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  ) : (
                    step.visibleId
                  )}
                </div>
                <div className="text-center mt-1">
                  {step.label}
                </div>
              </div>
              {step.value !== 'COMPLETED' && (
                <span className="block md:inline">
                  <svg
                    className="w-1 h-10 md:w-28 md:h-1"
                    viewBox="0 0 2 100"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="1"
                      y1="0"
                      x2="1"
                      y2="100"
                      stroke="black"
                      strokeWidth="1"
                    />
                  </svg>
                </span>
              )}
            </div>
          )
      )}
    </div>
  )
}
export default OrderStatusStep