'server only'

import { serial, varchar, timestamp, pgTable, integer } from 'drizzle-orm/pg-core'
import crypto from 'crypto'
import { db } from './db'
import { and, desc, eq } from 'drizzle-orm'

export const TOKEN_COOLDOWN_MIN = 2
export const TOKEN_EXPIRATION_HOUR = 24

const TOKEN_COOLDOWN_MILI = new Date(0).setMinutes(TOKEN_COOLDOWN_MIN)
const TOKEN_EXPIRATION_MILI = new Date(0).setHours(TOKEN_EXPIRATION_HOUR)

const verificationTokens = pgTable('verification_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'),
  token: varchar('token', { length: 64 }),
  createdAt: timestamp('created_at').defaultNow()
})

export type VerificationToken = typeof verificationTokens.$inferSelect

export async function createVerificationToken(userId: number) {
  const records = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.userId, userId))
    .orderBy(desc(verificationTokens.createdAt))

  const latestToken = records.at(0)

  if (latestToken !== undefined) {
    const latest = latestToken.createdAt!.getTime()
    const now = Date.now()

    if (now - latest < TOKEN_COOLDOWN_MILI)
      throw new Error('Verification token generation cooldown')
  }

  const token = crypto.randomBytes(32).toString('hex')

  await db.insert(verificationTokens).values({
    userId,
    token
  })
  return token
}

export async function validateVerificationToken(userId: number, token: string) {
  const records = await db
    .select()
    .from(verificationTokens)
    .where(and(eq(verificationTokens.userId, userId), eq(verificationTokens.token, token)))

  const dbToken = records.at(0)

  if (dbToken === undefined) {
    throw new Error('Invalid verification token')
  }

  const tokenTime = dbToken.createdAt!.getTime()
  const now = Date.now()

  if (now - tokenTime > TOKEN_EXPIRATION_MILI) throw new Error('Expired verification token')

  await db.delete(verificationTokens).where(eq(verificationTokens.userId, userId))

  return true
}

export async function deleteTokens(userId: number) {
  await db.delete(verificationTokens).where(eq(verificationTokens.userId, userId))
}