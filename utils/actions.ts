'use server'

import { getUser, setUserOrganization} from '@/db/users'
import { sendMailBudgetApproved, sendMailBudgetsToRewiew, sendMailBuyerSelected, sendMailGoBackToBudgetsInProgress, sendMailModifyShippingDate, sendMailNewQuestion, sendMailOrderArrived, sendMailOrderCancelled, sendMailOrderCreated, sendMailOrderInformationComplete, sendMailOrderInformationIncomplete, sendMailOrderRejected, sendMailProductUpdated, sendMailValidation } from './mailer'
import { createOrderWithProducts, type OrderProduct, type Order, addBudgets, getBudgets, removeBudget, updateOrder, type OrderBudget, updateBudget, addAttachments, getAttachments, type OrderHistory, addHistory, getHistory, deleteCreatedByInOrders, removeFile } from '@/db/orders'
import { auth } from '@/auth'
import { createDeliveryPoint, createOrganization, deleteDeliveryPoint, type Organization, type DeliveryPoint, removeOrganization } from '@/db/organizations'

export async function getUserAction() {
  const session = await auth()
  if (!session?.user) return null

  const user = await getUser(session?.user.email!)
  return user
}

export async function sendMailBuyerSelectedAction(orderId: number, createdBy: number, assignedBuyerId: number, createdAt: Date) {

  await sendMailBuyerSelected(orderId, createdBy, assignedBuyerId, createdAt)
}

export async function sendMailBudgetApprovedAction(orderId: number, assignedBuyerId: number, createdAt: string) {
  await sendMailBudgetApproved(orderId, assignedBuyerId, createdAt)
}

export async function sendMailNewQuestionAction(orderId: number, createdBy: number, assignedBuyerId: number) {
  await sendMailNewQuestion(orderId, createdBy, assignedBuyerId)
}

export async function sendMailOrderArrivedAction(orderId: number, createdBy: number, assignedBuyerId: number, createdAt: Date) {
  await sendMailOrderArrived(orderId, createdBy, assignedBuyerId, createdAt)
}

export async function sendMailModifyShippingDateAction(orderId: number, createdBy: number, createdAt: Date) {
  await sendMailModifyShippingDate(orderId, createdBy, createdAt)
}
export async function sendMailOrderCreatedAction(orderId: number, createdBy: number, products: OrderProduct[], createdAt: Date) {
  await sendMailOrderCreated(orderId, createdBy, products, createdAt)
}

export async function sendMailProductUpdatedAction(orderId: number, createdBy: number, assignedBuyerId: number) {
  await sendMailProductUpdated(orderId, createdBy, assignedBuyerId)
}

export async function sendMailOrderRejectedAction(orderId: number, createdBy: number, assignedBuyerId: number) {
  await sendMailOrderRejected(orderId, createdBy, assignedBuyerId)
}

export async function sendMailOrderCancelledAction(orderId: number, createdBy: number, assignedBuyerId: number, createdAt: Date) {
  await sendMailOrderCancelled(orderId, createdBy, assignedBuyerId, createdAt)
}

export async function sendMailValidationAction(userId: number, mail: string, firstName: string) {
  await sendMailValidation(userId, mail, firstName)
}
export async function sendMailGoBackToBudgetsInProgressAction(orderId: number, createdBy: number, assignedBuyerId: number, createdAt: Date) {
  await sendMailGoBackToBudgetsInProgress(orderId, createdBy, assignedBuyerId, createdAt)
}

export async function sendMailBudgetsToRewiewAction(orderId: number, createdBy: number, assignedBuyerId: number, createdAt: Date) {
  await sendMailBudgetsToRewiew(orderId, createdBy, assignedBuyerId, createdAt)
}
export async function sendMailOrderInformationCompleteAction(orderId: number, createdBy: number, assignedBuyerId: number, createdAt: Date, products: OrderProduct[]) {
  await sendMailOrderInformationComplete(orderId, createdBy, assignedBuyerId, createdAt, products)
}

export async function sendMailOrderInformationIncompleteAction(orderId: number, createdBy: number, createdAt: Date) {
  await sendMailOrderInformationIncomplete(orderId, createdBy, createdAt)
}
export async function createOrganizationAction(
  organization: Pick<Organization, 'name' | 'domains'>
) {
  return await createOrganization({
    ...organization,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

export async function removeOrganizationAction(organizationId: number) {
  return await removeOrganization(organizationId)
}

export async function setUserOrganizationAction(userId: number, organizationId: number | null) {
  await setUserOrganization(userId, organizationId)
}

export async function deleteCreatedByInOrdersAction(userId: number) {
  await deleteCreatedByInOrders(userId)
}

export async function createOrderWithProductsAction(
  orderPartial: Pick<
    Order,
    | 'organizationId'
    | 'createdBy'
    | 'title'
    | 'deliveryPointId'
    | 'shippingMethod'
    | 'notes'
    | 'finalClient'
    | 'shippingDate'
    | 'finalAddress'
  >,
  products: Omit<OrderProduct, 'id' | 'orderId'>[]
) {
  return await createOrderWithProducts(orderPartial, products)
}

export async function getBudgetsAction(orderId: number) {
  return await getBudgets(orderId)
}

export async function updateOrderAction(order: Pick<Order, 'id'> & Partial<Order>) {
  return await updateOrder(order)
}

export async function addBudgetsAction(orderId: number, formData: FormData) {
  const files = Array.from(formData.values()) as File[]
  
  await addBudgets(orderId, files)
}

export async function updateBudgetsAction(budget: Pick<OrderBudget, 'id'> & Partial<OrderBudget>) {
  return await updateBudget(budget)
}

export async function removeBudgetAction(budgetId: number) {
  await removeBudget(budgetId)
}

export async function getAttachmentsAction(orderId: number) {
  return await getAttachments(orderId)
}

export async function addAttachmentsAction(orderId: number, formData: FormData) {
  const files = Array.from(formData.values()) as File[]

  return await addAttachments(orderId, files)
}

export async function createDeliveryPointAction(DeliveryPoint: Omit<DeliveryPoint, 'id'>) {
  return await createDeliveryPoint(DeliveryPoint)
}

export async function deleteDeliveryPointAction(DeliveryPointId: number) {
  return await deleteDeliveryPoint(DeliveryPointId)
}

export async function getHistoryAction(orderId: number) {
  return await getHistory(orderId)
}

export async function addHistoryAction(history: Omit<OrderHistory, 'id' | 'date'>) {
  return await addHistory(history)
}

export async function removeFileAction(fileId: number) {
  return await removeFile(fileId)
}