import { getOrderById } from '@/db/orders'
import { updateOrder } from '@/db/orders'
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const orderId = Number(url.searchParams.get('id'))
    if (!orderId || isNaN(orderId)) {
      throw new Error('Invalid order ID')
    }
    const order = await getOrderById(orderId)
    return new Response(JSON.stringify(order), { headers: { 'content-type': 'application/json', }, })
  } catch (error: any) {
    console.error('Error fetching order:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json', },
    })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const updateExistingOrder = await updateOrder(data)

    return new Response(JSON.stringify(updateExistingOrder), { headers: { 'content-type': 'application/json', }, })
  } catch (error: any) {
    console.error('Error updating order:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json', },
    })
  }
}
