type OrderStatus =
  | 'PENDING'
  | 'ASSIGNED_BUYER'
  | 'ADDITIONAL_INFORMATION_PENDING'
  | 'ORDER_INFORMATION_COMPLETE'
  | 'BUDGETS_IN_PROGRESS'
  | 'BUDGETS_TO_REVIEW'
  | 'BUDGETS_APPROVED'
  | 'PURCHASE_IN_PROGRESS'
  | 'PURCHASE_COMPLETED'
  | 'SHIPPING_IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'

interface Steps {
  value: OrderStatus
  label: string
  isVisibleOnSteps?: boolean
  visibleId?: number
  completed?: boolean
}
