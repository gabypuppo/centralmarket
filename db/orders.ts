'server only'
import { alias, boolean, integer, jsonb, pgTable, real, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { db } from './db'
import { desc, eq, or, and, getTableColumns, ilike, like, gte, lte, sum, count, sql, isNotNull, not, isNull } from 'drizzle-orm'
import { del, put } from '@vercel/blob'
import { deliveryPoints, type Organization, organizations } from './organizations'
import { getUserById, users } from './users'

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
  finalBudgetCurrency: varchar('final_budget_currency'),
  budgetedAt: timestamp('budgeted_at'),
  approvedAt: timestamp('approved_at'),
  followUpMail1DaySent: boolean('follow_up_mail_day_sent'),
  followUpMail3DaySent: boolean('follow_up_mail_3days_sent'),
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
            ilike(orders.title, `%${where}%`),
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

export async function getOrdersByUser(userId: number, where?: string, status?: OrderStatus) {
  const user = await getUserById(userId)

  if (user?.role === 'user' || user?.role === 'admin') {
    return await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.createdBy, userId),
          status ? like(orders.orderStatus, status) : undefined,
          where
            ? or(
              ilike(orders.title, `%${where}%`),
              ilike(orders.finalClient, `%${where}%`),
              ilike(orders.finalAddress, `%${where}%`),
              ilike(orders.notes, `%${where}%`)
            )
            : undefined
        )
      )
  }

  if (user?.role === 'user-cm' || user?.role === 'admin-cm') {
    return await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.assignedBuyerId, userId),
          status ? like(orders.orderStatus, status) : undefined,
          where
            ? or(
              ilike(orders.title, `%${where}%`),
              ilike(orders.finalClient, `%${where}%`),
              ilike(orders.finalAddress, `%${where}%`),
              ilike(orders.notes, `%${where}%`)
            )
            : undefined
        )
      )
  }

  return []
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

export async function getLatestOrdersByUser(userId: number, where?: string, status?: OrderStatus) {
  const user = await getUserById(userId)

  if (user?.role === 'user' || user?.role === 'admin') {
    return db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.createdBy, userId),
          or(
            eq(orders.orderStatus, 'ADDITIONAL_INFORMATION_PENDING'),
            eq(orders.orderStatus, 'BUDGETS_TO_REVIEW')
          ),
          status ? like(orders.orderStatus, status) : undefined,
          where
            ? or(
              ilike(orders.title, `%${where}%`),
              ilike(orders.finalClient, `%${where}%`),
              ilike(orders.finalAddress, `%${where}%`),
              ilike(orders.notes, `%${where}%`)
            )
            : undefined
        )
      )
      .orderBy(desc(orders.createdAt))
  }

  if (user?.role === 'user-cm' || user?.role === 'admin-cm') {
    return db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.assignedBuyerId, userId),
          or(
            eq(orders.orderStatus, 'ASSIGNED_BUYER'),
            eq(orders.orderStatus, 'ORDER_INFORMATION_COMPLETE'),
            eq(orders.orderStatus, 'BUDGETS_IN_PROGRESS'),
            eq(orders.orderStatus, 'PURCHASE_IN_PROGRESS')
          ),
          status ? like(orders.orderStatus, status) : undefined,
          where
            ? or(
              ilike(orders.title, `%${where}%`),
              ilike(orders.finalClient, `%${where}%`),
              ilike(orders.finalAddress, `%${where}%`),
              ilike(orders.notes, `%${where}%`)
            )
            : undefined
        )
      )
      .orderBy(desc(orders.createdAt))
  }

  return []
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

export async function getAnalyticsByUserId(
  userId: number,
  leftEndDate?: Date,
  rightEndDate?: Date
) {
  return await db
    .select({
      currency: orders.finalBudgetCurrency,
      subtotal: sum(orders.finalBudgetSubtotal),
      count: count(orders.finalBudgetCurrency)
    })
    .from(orders)
    .where(
      and(
        eq(orders.createdBy, userId),
        eq(orders.orderStatus, 'COMPLETED'),
        leftEndDate ? gte(orders.approvedAt, leftEndDate) : undefined,
        rightEndDate ? lte(orders.approvedAt, rightEndDate) : undefined
      )
    )
    .groupBy(orders.finalBudgetCurrency)
    .orderBy(orders.finalBudgetCurrency)
}

export async function getAnalyticsByOrganizationId(
  organizationId: number,
  options?: {
    leftEndDate?: Date,
    rightEndDate?: Date
    categoryId?: number
  }
) {
  return await db
    .select({
      currency: orders.finalBudgetCurrency,
      subtotal: sum(orders.finalBudgetSubtotal),
      count: count(orders.finalBudgetCurrency)
    })
    .from(orders)
    .where(
      and(
        eq(orders.organizationId, organizationId),
        eq(orders.orderStatus, 'COMPLETED'),
        options?.leftEndDate ? gte(orders.approvedAt, options.leftEndDate) : undefined,
        options?.rightEndDate ? lte(orders.approvedAt, options.rightEndDate) : undefined,
        options?.categoryId
          ? and(eq(orders.categoryId, options.categoryId), isNotNull(orders.categoryId))
          : undefined
      )
    )
    .groupBy(orders.finalBudgetCurrency)
    .orderBy(orders.finalBudgetCurrency)
}

export async function getMonthlyAnalyticsByOrganizationId(
  organizationId: number,
  options?: {
    leftEndDate?: Date,
    rightEndDate?: Date
    categoryId?: number
  }
) {
  return await db
    .select({
      year: sql<string>`EXTRACT(YEAR FROM approved_at)`,
      month: sql<string>`EXTRACT(MONTH FROM approved_at)`,
      ARS: sql<string>`SUM(CASE WHEN final_budget_currency = 'ARS' THEN final_budget_subtotal ELSE 0 END)`,
      USD: sql<string>`SUM(CASE WHEN final_budget_currency = 'USD' THEN final_budget_subtotal ELSE 0 END)`
    })
    .from(orders)
    .where(
      and(
        eq(orders.organizationId, organizationId),
        eq(orders.orderStatus, 'COMPLETED'),
        not(isNull(orders.approvedAt)),
        options?.leftEndDate ? gte(orders.approvedAt, options.leftEndDate) : undefined,
        options?.rightEndDate ? lte(orders.approvedAt, options.rightEndDate) : undefined,
        options?.categoryId
          ? and(eq(orders.categoryId, options.categoryId), isNotNull(orders.categoryId))
          : undefined
      )
    )
    .groupBy(sql`EXTRACT(YEAR FROM approved_at)`, sql`EXTRACT(MONTH FROM approved_at)`)
    .orderBy(sql`EXTRACT(YEAR FROM approved_at)`, sql`EXTRACT(MONTH FROM approved_at)`)
}

export async function getOrganizationUsersOrderAnalytics(
  organizationId: number,
  options?: {
    categoryId?: number
  }
) {
  const user = getTableColumns(users)

  return await db
    .select({
      createdBy: { ...user },
      weekly: { 
        count: sql<string>`COUNT(*) FILTER (WHERE EXTRACT(WEEK FROM orders.approved_at) = EXTRACT(WEEK FROM CURRENT_DATE) AND EXTRACT(YEAR FROM orders.approved_at) = EXTRACT(YEAR FROM CURRENT_DATE))`, 
        usd: sql<string>`SUM(CASE WHEN final_budget_currency = 'USD' THEN final_budget_subtotal ELSE 0 END) FILTER (WHERE EXTRACT(WEEK FROM orders.approved_at) = EXTRACT(WEEK FROM CURRENT_DATE) AND EXTRACT(YEAR FROM orders.approved_at) = EXTRACT(YEAR FROM CURRENT_DATE))`,
        ars: sql<string>`SUM(CASE WHEN final_budget_currency = 'ARS' THEN final_budget_subtotal ELSE 0 END) FILTER (WHERE EXTRACT(WEEK FROM orders.approved_at) = EXTRACT(WEEK FROM CURRENT_DATE) AND EXTRACT(YEAR FROM orders.approved_at) = EXTRACT(YEAR FROM CURRENT_DATE))` 
      },
      monthly: { 
        count: sql<string>`COUNT(*) FILTER (WHERE EXTRACT(MONTH FROM orders.approved_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM orders.approved_at) = EXTRACT(YEAR FROM CURRENT_DATE))`,
        usd: sql<string>`SUM(CASE WHEN final_budget_currency = 'USD' THEN final_budget_subtotal ELSE 0 END) FILTER (WHERE EXTRACT(MONTH FROM orders.approved_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM orders.approved_at) = EXTRACT(YEAR FROM CURRENT_DATE))`,
        ars: sql<string>`SUM(CASE WHEN final_budget_currency = 'ARS' THEN final_budget_subtotal ELSE 0 END) FILTER (WHERE EXTRACT(MONTH FROM orders.approved_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM orders.approved_at) = EXTRACT(YEAR FROM CURRENT_DATE))` 
      },
      yearly: { 
        count: sql<string>`COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM orders.approved_at) = EXTRACT(YEAR FROM CURRENT_DATE))`, 
        usd: sql<string>`SUM(CASE WHEN final_budget_currency = 'USD' THEN final_budget_subtotal ELSE 0 END) FILTER (WHERE EXTRACT(YEAR FROM orders.approved_at) = EXTRACT(YEAR FROM CURRENT_DATE))`,
        ars: sql<string>`SUM(CASE WHEN final_budget_currency = 'ARS' THEN final_budget_subtotal ELSE 0 END) FILTER (WHERE EXTRACT(YEAR FROM orders.approved_at) = EXTRACT(YEAR FROM CURRENT_DATE))` 
      },
      leadtimes: {
        createdToBudgetedDays: sql<string>`AVG(EXTRACT(EPOCH FROM (orders.budgeted_at - orders.created_at)) / 86400)`,
        budgetedToApprovedDays: sql<string>`AVG(EXTRACT(EPOCH FROM (orders.approved_at - orders.budgeted_at)) / 86400)`,
        approvedToArrivedDays: sql<string>`AVG(EXTRACT(EPOCH FROM (orders.shipping_date - orders.approved_at)) / 86400) FILTER (WHERE orders.is_arrived = TRUE)`
      }
    })
    .from(orders)
    .leftJoin(users, eq(users.id, orders.createdBy))
    .where(
      and(
        isNotNull(orders.createdBy),
        eq(orders.organizationId, organizationId),
        options?.categoryId
          ? and(eq(orders.categoryId, options.categoryId), isNotNull(orders.categoryId))
          : undefined
      )
    )
    .groupBy(...Object.values(user))
}

export async function getOrdersNeedingFollowUp () {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

  const needOneDayPromise = db
    .select()
    .from(orders)
    .where(
      and(
        or(isNull(orders.followUpMail1DaySent), eq(orders.followUpMail1DaySent, false)),
        lte(orders.updatedAt, oneDayAgo),
        or(
          eq(orders.orderStatus, 'ADDITIONAL_INFORMATION_PENDING'),
          eq(orders.orderStatus, 'BUDGETS_TO_REVIEW')
        )
      )
    )

  const needThreeDaysPromise = db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.followUpMail1DaySent, true),
        or(isNull(orders.followUpMail1DaySent), eq(orders.followUpMail3DaySent, false)),
        lte(orders.updatedAt, threeDaysAgo),
        or(
          eq(orders.orderStatus, 'ADDITIONAL_INFORMATION_PENDING'),
          eq(orders.orderStatus, 'BUDGETS_TO_REVIEW')
        )
      )
    )

  const [needOneDay, needThreeDays] = await Promise.all([needOneDayPromise, needThreeDaysPromise])

  return { needOneDay, needThreeDays }
}
