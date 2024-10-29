'server only'
import { alias, boolean, integer, jsonb, pgTable, real, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { db } from './db'
import { desc, eq, or, and, getTableColumns, ilike, like } from 'drizzle-orm'
import { del, put } from '@vercel/blob'
import { deliveryPoints, type Organization, organizations } from './organizations'
import { users } from './users'

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull(),
  createdBy: integer('created_by'),
  assignedBuyerId: integer('assigned_buyer_id'),
  title: varchar('title'),
  orderStatus: varchar('order_status').$type<OrderStatus>(),
  deliveryPointId: integer('delivery_point_id'),
  shippingMethod: varchar('shipping_method', { length: 64 }), // Crear tabla shipping methods
  orderObservations: text('order_observations'),
  notes: text('notes'),
  finalClient: varchar('final_client'),
  finalAddress: varchar('final_address'),
  selectedBudgetId: integer('selected_budget_id'),
  shippingDate: timestamp('shipping_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  questions: jsonb('questions').array(),
  categoryId: integer('category_id'),
  isArrived: boolean('is_arrived').notNull().default(false),
  budgetsObservations: varchar('budgets_observations'),
  remittance: varchar('remittance'),
  invoice: varchar('invoice'),
  finalBudgetSubtotal: integer('final_budget_subtotal'),
  budgetedAt: timestamp('budgeted_at'),
  approvedAt: timestamp('approved_at')
})

export type Order = typeof orders.$inferSelect

const orderProducts = pgTable('order_products', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  product: varchar('product', { length: 255 }),
  quantity: real('quantity'),
  quantityUnit: varchar('quantity_unit', { length: 16 }),
  estimatedCost: real('estimated_cost'),
  estimatedCostCurrency: varchar('estimated_cost_currency', { length: 16 }),
  productNotes: text('product_notes')
})

export type OrderProduct = typeof orderProducts.$inferSelect

const orderBudgets = pgTable('order_budgets', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  mimeType: varchar('mime_type'),
  fileName: varchar('file_name'),
  fileUrl: varchar('file_url'),
  isRejected: boolean('is_rejected'),
  rejectionReason: varchar('rejection_reason')
})

export type OrderBudget = typeof orderBudgets.$inferSelect

const orderAttachments = pgTable('order_attachments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  mimeType: varchar('mime_type'),
  fileName: varchar('file_name'),
  fileUrl: varchar('file_url')
})

export type OrderAttachment = typeof orderAttachments.$inferSelect

const orderHistory = pgTable('order_history', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  modifiedBy: varchar('modified_by'),
  label: varchar('label'),
  date: timestamp('date', { mode: 'string' }).notNull().$default(() => new Date().toISOString())
})

export type OrderHistory = typeof orderHistory.$inferSelect

const orderQuestions = pgTable('order_questions', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  userId: integer('user_id').notNull(),
  question: varchar('question'),
  answer: varchar('answer'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().$default(() => new Date().toISOString())
})

export type OrderQuestion = typeof orderQuestions.$inferSelect

const orderCategories = pgTable('order_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name')
})

export type OrderCategory = typeof orderCategories.$inferSelect

const orderFiles = pgTable('order_files', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  senderId: integer('sender_id').notNull(),
  mimeType: varchar('mime_type'),
  fileName: varchar('file_name'),
  fileUrl: varchar('file_url'),
})

export type OrderFile = typeof orderFiles.$inferSelect

export async function getOrdersCentralMarket(
  where?: string,
  status?: OrderStatus
): Promise<(Order & { organization: Organization | null })[]> {
  const order = getTableColumns(orders)
  const organization = getTableColumns(organizations)

  return await db
    .select({ ...order, organization: { ...organization } })
    .from(orders)
    .where(
      and(
        status ? like(orders.orderStatus, status) : undefined,
        where
          ? or(
            ilike(orders.finalClient, `%${where}%`),
            ilike(orders.finalAddress, `%${where}%`),
            ilike(orders.notes, `%${where}%`),
            ilike(organizations.name, `%${where}%`)
          )
          : undefined
      )
    )
    .innerJoin(organizations, eq(orders.organizationId, organizations.id))
}

export async function getOrdersByOrganization(
  organizationId: number,
  where?: string,
  status?: OrderStatus
) {
  return await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.organizationId, organizationId),
        status ? like(orders.orderStatus, status) : undefined,
        where
          ? or(
            ilike(orders.finalClient, `%${where}%`),
            ilike(orders.finalAddress, `%${where}%`),
            ilike(orders.notes, `%${where}%`)
          )
          : undefined
      )
    )
}

export async function getOrdersByBuyer(buyerId: number) {
  return await db.select().from(orders).where(eq(orders.assignedBuyerId, buyerId))
}

export async function getOrdersByUser(userId: number) {
  return await db.select().from(orders).where(eq(orders.createdBy, userId))
}

export async function createOrderWithProducts(
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
  const newOrder = (
    await db
      .insert(orders)
      .values({
        organizationId: orderPartial.organizationId,
        createdBy: orderPartial.createdBy,
        title: orderPartial.title,
        assignedBuyerId: null,
        orderStatus: 'PENDING',
        selectedBudgetId: null,
        deliveryPointId: orderPartial.deliveryPointId,
        shippingMethod: orderPartial.shippingMethod,
        orderObservations: null,
        notes: orderPartial.notes,
        finalClient: orderPartial.finalClient,
        finalAddress: orderPartial.finalAddress,
        shippingDate: orderPartial.shippingDate,
        createdAt: new Date(),
        updatedAt: null,
        categoryId: null,
        questions: [],
        isArrived: false
      })
      .returning()
  ).at(0)

  if (newOrder === undefined) throw new Error('Order insert failed.')

  await db
    .insert(orderProducts)
    .values(products.map((product) => ({ orderId: newOrder.id, ...product })))
  return newOrder
}

export async function updateOrderProduct(product: Pick<OrderProduct, 'id'> & Partial<OrderProduct>) {
  return await db.update(orderProducts).set(product).where(eq(orderProducts.id, product.id)).returning()
}

export async function getOrderById(id: number) {
  return (await db.select().from(orders).where(eq(orders.id, id)))[0]
}

export async function getProductsByOrderId(orderId: number) {
  return await db.select().from(orderProducts).where(eq(orderProducts.orderId, orderId))
}

export async function updateOrder(order: Pick<Order, 'id'> & Partial<Order>) {
  return await db.update(orders).set(order).where(eq(orders.id, order.id)).returning()
}

export async function getBudgets(orderId: number) {
  return await db.select().from(orderBudgets).where(eq(orderBudgets.orderId, orderId))
}

export async function addBudgets(orderId: number, files: File[]) {
  await Promise.all(files.map(async (file) => {
    const { url } = await put(`${orderId}/budgets/${file.name}`, file, { access: 'public' })

    await db.insert(orderBudgets).values({
      orderId,
      mimeType: file.type,
      fileName: file.name,
      fileUrl: url
    })
  }))

  return await getOrderById(orderId)
}

export async function updateBudget(budget: Pick<OrderBudget, 'id'> & Partial<OrderBudget>) {
  return await db.update(orderBudgets).set(budget).where(eq(orderBudgets.id, budget.id)).returning()
}

export async function removeBudget(budgetId: number) {
  const query = await db.select().from(orderBudgets).where(eq(orderBudgets.id, budgetId))
  const budget = query[0]
  if (budget === undefined) return

  await del(budget.fileUrl!)
  await db.delete(orderBudgets).where(eq(orderBudgets.id, budgetId))
}

export async function getLatestOrderUser(userId: number) {
  return db
    .select()
    .from(orders)
    .where(
      and(
        or(
          eq(orders.orderStatus, 'ADDITIONAL_INFORMATION_PENDING'),
          eq(orders.orderStatus, 'BUDGETS_TO_REVIEW')
        ),
        or(eq(orders.createdBy, userId))
      )
    )
    .orderBy(desc(orders.createdAt))
}

export async function getLatestOrderBuyer(buyerId: number) {
  return db
    .select()
    .from(orders)
    .where(
      and(
        or(
          eq(orders.orderStatus, 'ASSIGNED_BUYER'),
          eq(orders.orderStatus, 'ORDER_INFORMATION_COMPLETE'),
          eq(orders.orderStatus, 'BUDGETS_IN_PROGRESS'),
          eq(orders.orderStatus, 'PURCHASE_IN_PROGRESS')
        ),
        or(eq(orders.assignedBuyerId, buyerId))
      )
    )
    .orderBy(desc(orders.createdAt))
}

export async function getAttachments(orderId: number) {
  return await db.select().from(orderAttachments).where(eq(orderAttachments.orderId, orderId))
}

export async function addAttachments(orderId: number, files: File[]) {
  await Promise.all(files.map(async (file) => {
    const { url } = await put(`${orderId}/attachments/${file.name}`, file, { access: 'public' })

    await db.insert(orderAttachments).values({
      orderId,
      mimeType: file.type,
      fileName: file.name,
      fileUrl: url
    })
  }))
}

export async function removeAttachment(attachmentId: number) {
  const query = await db.select().from(orderAttachments).where(eq(orderAttachments.id, attachmentId))
  const budget = query[0]
  if (budget === undefined) return

  await del(budget.fileUrl!)
  await db.delete(orderAttachments).where(eq(orderAttachments.id, attachmentId))
}

export async function getHistory(orderId: number) {
  return await db.select().from(orderHistory).where(eq(orderHistory.orderId, orderId))
}

export async function addHistory(history: Omit<OrderHistory, 'id' | 'date'>) {
  return await db.insert(orderHistory).values(history).returning()
}

export async function getQuestions(orderId: number) {
  return await db.select().from(orderQuestions).where(eq(orderQuestions.orderId, orderId))
}

export async function addQuestion(question: Omit<OrderQuestion, 'id' | 'createdAt'>) {
  return await db.insert(orderQuestions).values(question)
}

export async function editQuestion(question: Pick<OrderQuestion, 'id'> & Partial<OrderQuestion>) {
  return await db.update(orderQuestions).set(question).where(eq(orderQuestions.id, question.id))
}

export async function getOrderCategories() {
  return await db.select().from(orderCategories)
}

export async function getOrderCategory(orderCategoryId: number) {
  return await db.select().from(orderCategories).where(eq(orderCategories.id, orderCategoryId))
}

export async function deleteCreatedByInOrders(userId: number) {
  return await db.update(orders).set({ createdBy: 0 }).where(eq(orders.createdBy, userId))
}

export async function getFiles(orderId: number) {
  return await db.select().from(orderFiles).where(eq(orderFiles.orderId, orderId))
}

export async function addFiles(orderId: number, userId: number, files: File[]) {
  await Promise.all(files.map(async (file) => {
    const { url } = await put(`${orderId}/attachments/${file.name}`, file, { access: 'public' })

    await db.insert(orderFiles).values({
      orderId,
      senderId: userId,
      mimeType: file.type,
      fileName: file.name,
      fileUrl: url
    })
  }))
}

export async function removeFile(fileId: number) {
  await db.delete(orderFiles).where(eq(orderFiles.id, fileId))
}

export async function getOrdersCSVData(
  organizationId?: number
) {
  const order = getTableColumns(orders)
  const organization = getTableColumns(organizations)
  const deliveryPoint = getTableColumns(deliveryPoints)
  const product = getTableColumns(orderProducts)
  const category = getTableColumns(orderCategories)
  const user = getTableColumns(users)
  
  const buyers = alias(users, 'buyers')
  const buyer = getTableColumns(buyers)

  return await db
    .select({
      ...order, 
      organization: { ...organization }, 
      deliveryPoint: { ...deliveryPoint },
      product: { ...product },
      category: { ...category },
      creator: { ...user },
      buyer: { ...buyer }
      
    })
    .from(orders)
    .where(organizationId ? eq(orders.organizationId, organizationId) : undefined)
    .leftJoin(organizations, eq(orders.organizationId, organizations.id))
    .leftJoin(deliveryPoints, eq(orders.deliveryPointId, deliveryPoints.id))
    .leftJoin(orderProducts, eq(orders.id, orderProducts.orderId))
    .leftJoin(users, eq(orders.createdBy, users.id))
    .leftJoin(buyers, eq(order.assignedBuyerId, buyers.id))
    .leftJoin(orderCategories, eq(order.categoryId, orderCategories.id))
    .orderBy(order.id)
}