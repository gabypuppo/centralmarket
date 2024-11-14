import { auth } from '@/auth'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/TextArea'
import { addQuestion, type Order } from '@/db/orders'
import { sendMailNewQuestionAction } from '@/utils/actions'
import { revalidatePath } from 'next/cache'

interface QuestionFormProps {
  order: Order
}
export default function QuestionForm({ order }: QuestionFormProps) {
  async function questionSubmitAction(formData: FormData) {
    'use server'
    const session = await auth()
    const question = formData.get('question') as string

    if (!session) return

    if (!question || !question.length) return

    await addQuestion({
      orderId: order.id,
      userId: session?.user.id,
      question,
      answer: ''
    })
    if (order.createdBy && order.assignedBuyerId) {
      await sendMailNewQuestionAction(order.id, order.createdBy, order.assignedBuyerId)
    } else {
      console.log('ERROR: Unable to send new question email. orderId:', order.id)
    }

    revalidatePath(`/${order.id}/questions`)
  }
  return (
    <form action={questionSubmitAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="question">Tu pregunta</Label>
        <Textarea
          name="question"
          id="question"
          placeholder="Cual es tu pregunta?"
          className="min-h-[100px]"
        />
      </div>
      <Button type="submit">Enviar</Button>
    </form>
  )
}
