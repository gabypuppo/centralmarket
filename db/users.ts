"server only";
import {
  serial,
  varchar,
  boolean,
  pgTable,
  integer,
} from "drizzle-orm/pg-core";
import { db } from "./db";
import { and, eq, getTableColumns, like, or } from "drizzle-orm";
import { getEmailDomain } from "@/utils";
import { genSaltSync, hashSync } from "bcrypt-ts";
import {
  getOrganizationByDomain,
  getOrganizationWithUserMetrics,
} from "./organizations";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 64 }),
  password: varchar("password", { length: 64 }),
  firstName: varchar("first_name", { length: 64 }),
  lastName: varchar("last_name", { length: 64 }),
  organizationId: integer("organization_id"),
  role: varchar("role", {
    length: 64,
    enum: ["user", "admin", "user-cm", "admin-cm"],
  }),
  isWhiteListedUser: varchar("is_whitelisted_user", { length: 64 }),
  createdAt: varchar("created_at", { length: 64 }),
  updatedAt: varchar("updated_at", { length: 64 }),
  isVerified: boolean("is_verified"),
});

export type UserWithPassword = typeof users.$inferSelect;
export type User = Omit<typeof users.$inferSelect, "password">;
export type PunchoutData = {
  buyerCookie: string;
  payloadID: string;
  checkoutRedirectTo: string;
};
export type UserPunchout = User & { punchout?: PunchoutData };

export async function getUser(email: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = getTableColumns(users);
  const res = await db
    .select({ ...rest })
    .from(users)
    .where(eq(users.email, email));
  return res.length > 0 ? res[0] : null;
}

export async function getUserById(id: number) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = getTableColumns(users);
  const res = await db
    .select({ ...rest })
    .from(users)
    .where(eq(users.id, id));
  return res.length > 0 ? res[0] : null;
}

export async function getMailWithUserId(createdBy: number) {
  const res = await db.select().from(users).where(eq(users.id, createdBy));
  return res.length > 0 ? res[0] : null;
}

export async function getUserWithPassword(email: string) {
  const res = await db.select().from(users).where(eq(users.email, email));
  return res.length > 0 ? res[0] : null;
}

export async function getUsersByOrganizationId(
  organizationId: number,
  where?: string,
) {
  return await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      role: users.role,
      isVerified: users.isVerified,
    })
    .from(users)
    .where(
      where
        ? and(
            eq(users.organizationId, organizationId),
            or(
              like(users.firstName, `%${where}%`),
              like(users.lastName, `%${where}%`),
              like(users.email, `%${where}%`),
            ),
          )
        : eq(users.organizationId, organizationId),
    );
}

export async function getUserNameAndIdByOrganizationId(
  organizationId: number,
  where?: string,
) {
  return await db
    .select()
    .from(users)
    .where(
      where
        ? and(
            eq(users.organizationId, organizationId),
            or(
              like(users.firstName, `%${where}%`),
              like(users.lastName, `%${where}%`),
              like(users.email, `%${where}%`),
            ),
          )
        : eq(users.organizationId, organizationId),
    );
}

export async function passwordHash(password: string) {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
}

export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) {
  const hash = await passwordHash(password);

  const domain = getEmailDomain(email);
  const organization = await getOrganizationByDomain(domain);
  const orgWithMetrics = await getOrganizationWithUserMetrics(
    organization?.id ?? -1,
  );

  const role =
    orgWithMetrics && orgWithMetrics.metrics.users === 0 ? "admin" : "user";

  return await db.insert(users).values({
    email,
    password: hash,
    firstName,
    lastName,
    organizationId: orgWithMetrics?.id,
    role,
  });
}

export async function verifyUser(userId: number) {
  // Update the user's verification status
  await db.update(users).set({ isVerified: true }).where(eq(users.id, userId));
}

export async function setUserOrganization(
  userId: number,
  organizationId: number | null,
) {
  await db
    .update(users)
    .set({
      organizationId,
      role: "user",
    })
    .where(eq(users.id, userId));
}

export async function changePassword(userId: number, password: string) {
  const hash = await passwordHash(password);
  await db.update(users).set({ password: hash }).where(eq(users.id, userId));
}
