import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const client = postgres(`${process.env.ENVIRONMENT === 'development' ? process.env.POSTGRES_DEVELOPMENT_URL : process.env.POSTGRES_URL!}?sslmode=require`)
export const db = drizzle(client)
