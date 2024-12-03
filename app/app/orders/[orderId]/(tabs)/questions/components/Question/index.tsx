import { auth } from '@/auth'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/TextArea'
import { editQuestion, getOrderById, type OrderQuestion } from '@/db/orders'
import { getUserById } from '@/db/users'
import { sendMailNewQuestionAction } from '@/utils/actions'
import { UserIcon } from 'assets/icons'
import { revalidatePath } from 'next/cache'

interface QuestionProps {
  question: OrderQuestion
}
export default async function Question({ question }: QuestionProps) {
  const session = await auth()
  if (!session) return

  const sender = await getUserById(question.userId)
  
  const questionAnswerAction = async (formData: FormData) => {
    'use server'
    const answer = formData.get('answer') as string

    await editQuestion({
      id: question.id,
      answer
    })

    const order = await getOrderById(question.orderId)

    if (!order || !order.createdBy || !order.assignedBuyerId) return

    await sendMailNewQuestionAction(question.orderId, order.createdBy, order.assignedBuyerId)

    revalidatePath(`/${question.orderId}/questions`)
  }

  return (
    <div className="grid gap-2 p-4 bg-muted rounded-md">
      <div className="flex items-center justify-between">
        <div className="font-medium">{question.question}</div>
        <div className="flex items-center">
          <UserIcon className="w-4 h-4 mr-2" />
          <span>{`${sender?.firstName} ${sender?.lastName}`}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground"></div>
      <div className="mt-2 text-muted-foreground">
        {sender?.email === session?.user?.email ? (
          question.answer ? (
            <div>
              <div className="font-medium">Respuesta:</div>
              <div>{question.answer}</div>
            </div>
          ) : (
            <div className="text-muted-foreground">Esperando respuesta...</div>
          )
        ) : question.answer ? (
          <div>
            <div className="font-medium">Tu respuesta:</div>
            <div>{question.answer}</div>
          </div>
        ) : (
          <form
            action={questionAnswerAction}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="answer">Tu respuesta</Label>
              <Textarea
                name="answer"
                id="answer"
                placeholder="Cual es tu respuesta?"
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit">Enviar respuesta</Button>
          </form>
        )}
      </div>
    </div>
  )
}
