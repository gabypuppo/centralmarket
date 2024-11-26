import { auth } from '@/auth'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import Select from '@/components/ui/Select'
import { addHistory, getOrderCategories, type Order, updateOrder } from '@/db/orders'
import { getUsersByOrganizationId } from '@/db/users'
import { sendMailBuyerSelectedAction } from '@/utils/actions'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Mal codigo, puede pasarse a ssr, usar form
interface SelectBuyerProps {
  order: Order
}
export default async function SelectBuyer({ order }: SelectBuyerProps) {
  const session = await auth()

  if (!session) redirect('/auth/login')

  const buyersPromise = getUsersByOrganizationId(session?.user.organizationId!)
  const orderCategoriesPromise = getOrderCategories()

  const [buyers, orderCategories] = await Promise.all([buyersPromise, orderCategoriesPromise])

  if (!buyers) {
    return <div>Cargando...</div>
  }

  // const updateBuyer = () => {
  //   if (!user || !buyer || !category || isUploading) return
  //   setIsUploading(true)

  //   updateOrderAction({
  //     id: orderData.id,
  //     assignedBuyerId: parseInt(buyer),
  //     orderStatus: 'ASSIGNED_BUYER',
  //     category
  //   })
  //     .then((res) => {
  //       setContextOrderData(res[0])

  //       return addHistoryAction({
  //         orderId: orderData.id,
  //         label: 'Comprador asignado'
  //       })
  //     })
  //     .then(() => {
  //       return sendMailAction(
  //         user,
  //         {
  //           templateId: 'd-0cc0d2be10f148ceb57719ca567b20c1',
  //           dynamicTemplateData: {
  //             subject: 'El pedido #' + orderData.id + ' tiene un comprador asignado',
  //             title: 'Comprador asignado',
  //             message:
  //               'Se ha asignado un comprador al pedido. Puedes ver los detalles en el siguiente link',
  //             order_url: 'https://central-market.vercel.app/app/orders/' + orderData.id
  //           }
  //         },
  //         orderData
  //       )
  //     })
  //     .then(() => {})
  //     .catch((err) => {
  //       console.error(err)
  //     })
  //     .finally(() => {
  //       setIsUploading(false)
  //     })
  // }

  const action = async (formData: FormData) => {
    'use server'
    const assignedBuyerId = parseInt(formData.get('buyer') as string)
    const categoryId = parseInt(formData.get('category') as string)
    const organizationId = session.user.organizationId

    await updateOrder({
      id: order.id,
      assignedBuyerId,
      categoryId,
      orderStatus: 'ASSIGNED_BUYER',
      updatedAt: new Date()
    })

    await addHistory({
      orderId: order.id,
      label: 'Comprador asignado',
      modifiedBy: organizationId === 1 ? 'Central Market' : 'Usuario'
    })

    if (!order.id || !order.createdBy || !assignedBuyerId || !order.createdAt) return
    
    await sendMailBuyerSelectedAction(order.id, order.createdBy, assignedBuyerId, order.createdAt)

    revalidatePath(`/${order.id}/actions`)
  }

  return (
    <form action={action} className="flex flex-col items-start gap-4">
      <h5 className="text-sm">Configura las opciones para este pedido</h5>
      <Label className="flex flex-col items-start gap-1 flex-1">
        Categoría de pedido
        <Select
          name="category"
          placeholder="Selecciona una categoría"
          className="text-base font-normal"
          options={[
            {
              items: orderCategories.map((orderCategory) => ({
                label: orderCategory.name ?? '',
                value: orderCategory.id.toString()
              }))
            }
          ]}
        />
      </Label>
      <Label className="flex flex-col items-start gap-1 flex-1">
        Comprador asignado
        <Select
          name="buyer"
          placeholder="Selecciona un comprador"
          className="text-base font-normal"
          options={[
            {
              items: buyers.map((user) => ({
                label: `${user.firstName} ${user.lastName} (${user.email})`,
                value: user.id.toString()
              }))
            }
          ]}
        />
      </Label>
      <Button type="submit">Asignar</Button>
    </form>
  )
}
