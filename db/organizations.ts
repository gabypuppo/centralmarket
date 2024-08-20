'server only'

import { serial, varchar, pgTable, integer, text } from 'drizzle-orm/pg-core'
import { db } from './db'
import { getUsersByOrganizationId, users } from './users'
import { eq, sql, arrayContains, countDistinct, getTableColumns } from 'drizzle-orm'
import { orders } from './orders'

export const organizations = pgTable('organizations', {
  id: serial('organization_id').primaryKey(),
  name: varchar('organization_name', { length: 64 }),
  domains: varchar('domains').array().notNull().default([]),
  createdAt: varchar('created_at', { length: 64 }),
  updatedAt: varchar('updated_at', { length: 64 })
})

export type Organization = typeof organizations.$inferSelect

const deliveryPoints = pgTable('delivery_points', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id'),
  name: varchar('name', { length: 64 }),
  address: varchar('address', { length: 64 }),
  city: varchar('city', { length: 64 }),
  state: varchar('state', { length: 64 }),
  postalCode: varchar('postal_code', { length: 64 }),
  country: varchar('country', { length: 64 }),
  additionalInfo: text('additional_info')
})

export type DeliveryPoint = typeof deliveryPoints.$inferSelect

export async function createOrganization(organization: Omit<Organization, 'id'>) {
  return await db.insert(organizations).values(organization).returning()
}

export async function removeOrganization(organizationId: number) {
  await db.delete(organizations).where(eq(organizations.id, organizationId))
  await db.update(users).set({ organizationId: null }).where(eq(users.organizationId, organizationId))
}

export async function getOrganizationsWithUserMetrics() {
  const columns = getTableColumns(organizations)
  return await db
    .select({
      ...columns,
      metrics: {
        users: countDistinct(users),
        orders: countDistinct(orders)
      }
    })
    .from(organizations)
    .leftJoin(users, eq(users.organizationId, organizations.id))
    .leftJoin(orders, eq(orders.organizationId, organizations.id))
    .groupBy(organizations.id)
}

export async function getOrganizationWithUserMetrics(organizationId: number) {
  const columns = getTableColumns(organizations)
  return (
    await db
      .select({
        ...columns,
        metrics: {
          users: countDistinct(users),
          orders: countDistinct(orders)
        }
      })
      .from(organizations)
      .leftJoin(users, eq(users.organizationId, organizations.id))
      .leftJoin(orders, eq(orders.organizationId, organizations.id))
      .groupBy(organizations.id)
      .where(eq(organizations.id, organizationId))
  ).at(0)
}

export async function getOrganizationByDomain(domain: string) {
  const organization = await db
    .select()
    .from(organizations)
    .where(arrayContains(organizations.domains, [domain]))
  return organization.at(0)
}

export async function getOrganizationMembers(organizationId: number, where: string) {
  return await getUsersByOrganizationId(organizationId, where)
}

export async function addOrganizationDomain(organizationId: number, domain: string) {
  return await db
    .update(organizations)
    .set({ domains: sql`array_append(domains, ${domain})` })
    .where(eq(organizations.id, organizationId))
}

export async function removeOrganizationDomain(organizationId: number, domain: string) {
  return await db
    .update(organizations)
    .set({ domains: sql`array_remove(domains, ${domain})` })
    .where(eq(organizations.id, organizationId))
}

export async function getOrganizationDeliveryPoints(organizationId: number) {
  return await db.select().from(deliveryPoints).where(eq(deliveryPoints.organizationId, organizationId))
}

export async function getDeliveryPointById(deliveryPointId: number) {
  const query = await db.select().from(deliveryPoints).where(eq(deliveryPoints.id, deliveryPointId))
  return query[0]
}

export async function createDeliveryPoint(deliveryPoint: Omit<DeliveryPoint, 'id'>) {
  return await db.insert(deliveryPoints).values(deliveryPoint).returning()
}

export async function deleteDeliveryPoint(deliveryPointId: number) {
  return await db.delete(deliveryPoints).where(eq(deliveryPoints.id, deliveryPointId))
}
