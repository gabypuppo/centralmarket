import { updateOrderProduct } from '@/db/orders'

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    await updateOrderProduct(data)
    return new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json', }, })

  } catch (error: any) {
    console.error('Error updating order:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json', },
    })
  }
}