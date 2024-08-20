import { getUsersByOrganizationId } from '@/db/users'

export async function GET(request: Request) {
  // get users from organizationId
  try {
    const url = new URL(request.url)
    const organizationId = Number(url.searchParams.get('organization_id'))
    const users = await getUsersByOrganizationId(organizationId)
    return new Response(JSON.stringify(users), { headers: { 'content-type': 'application/json' } })
  }
  catch (error) {
    console.error('Error fetching users:', (error as Error).message)
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}