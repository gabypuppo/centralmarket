import { getOrderById, getProductsByOrderId } from "@/db/orders";
import { punchoutOrderMessage } from "@/utils/actions";

export async function POST(request: Request) {
  const data = await request.json();

  console.log("Punchout order new", { data });

  const [order, products] = await Promise.all([
    getOrderById(data.orderId),
    getProductsByOrderId(data.orderId),
  ]);

  console.log("Punchout order new", { order, products });

  const response = await punchoutOrderMessage(
    data.punchoutData,
    order,
    products,
  );

  console.log("Punchout order new", { response });

  return new Response(JSON.stringify(response), {
    headers: { "content-type": "application/xml" },
  });
}
