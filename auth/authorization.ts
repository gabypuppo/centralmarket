'server only'
/* eslint-disable @stylistic/object-curly-newline */
import type { Order } from '@/db/orders'
import type { Organization } from '@/db/organizations'
import type { User } from '@/db/users'

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, resource: Permissions[Key]['dataType']) => boolean)

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]['action']]: PermissionCheck<Key>
    }>
  }>
}

type Permissions = {
  order: {
    dataType: Order
    action: 'read' | 'create' | 'delete' | 'handle'
  }
  orders: {
    dataType: Order[]
    action: 'read'
  }
  organization: {
    dataType: Organization
    action:
      | 'read'
      | 'create'
      | 'delete'
      | 'read-users'
      | 'delete-users'
      | 'read-delivery-points'
      | 'create-delivery-points'
      | 'delete-delivery-points'
      | 'read-analytics'
  }
  organizations: {
    dataType: Organization[]
    action: 'read'
  }
}

type Role = 'user' | 'admin' | 'user-cm' | 'admin-cm'

const ROLES: RolesWithPermissions = {
  user: {
    order: {
      create: true,
      read: (user, resource) =>
        user.id === resource.createdBy && user.organizationId === resource.organizationId
    },
    organization: {
      read: (user, resource) => user.organizationId === resource.id,
      'read-users': true,
      'read-delivery-points': true
    }
  },
  admin: {
    order: {
      create: true,
      read: (user, resource) => user.organizationId === resource.organizationId,
      delete: true
    },
    orders: {
      read: (user, resource) =>
        resource.every((order) => order.organizationId === user.organizationId)
    },
    organization: {
      read: (user, resource) => user.organizationId === resource.id,
      'read-users': true,
      'delete-users': true,
      'read-delivery-points': true,
      'create-delivery-points': true,
      'delete-delivery-points': true,
      'read-analytics': true
    }
  },
  'user-cm': {
    order: {
      read: true,
      handle: (user, resource) => user.id === resource.assignedBuyerId
    },
    organization: {
      'read-users': true
    }
  },
  'admin-cm': {
    order: {
      read: true,
      delete: true,
      handle: true
    },
    orders: {
      read: true,
    },
    organization: {
      read: true,
      create: true,
      delete: true,
      'read-users': true,
      'delete-users': true
    },
    organizations: {
      read: true
    }
  }
} as const

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]['action'],
  data?: Permissions[Resource]['dataType']
) {
  if (!user.role) return false
  const permission = ROLES[user.role][resource]?.[action]

  if (permission === undefined) return false
  if (typeof permission === 'boolean') return permission
  return data !== undefined && permission(user, data)
}
