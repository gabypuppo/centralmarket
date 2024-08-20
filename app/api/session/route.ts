import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()
    return new Response(JSON.stringify(session), { headers: { 'content-type': 'application/json' } })
  }
  catch (error) {
    console.error('Error fetching session:', (error as Error).message)
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}