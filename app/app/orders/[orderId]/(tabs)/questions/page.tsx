import { Card, CardContent } from '@/components/ui/Card'
import React from 'react'
import QuestionForm from './components/QuestionForm'
import { getOrderById, getQuestions } from '@/db/orders'
import Question from './components/Question'

interface PageProps {
  params: {
    orderId: string
  }
}
export default async function Page({ params }: PageProps) {
  const orderId = parseInt(params.orderId)
  const orderPromise = getOrderById(orderId)
  const questionsPromise = getQuestions(orderId)

  const [ order, questions] = await Promise.all([
    orderPromise,
    questionsPromise
  ])

  return (
    <Card>
      <CardContent className="space-y-2">
        <section className="w-full max-w-4xl mx-auto py-12 md:py-16 lg:py-20">
          <div className="px-4 md:px-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Hace preguntas y notas sobre tu pedido
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Aquí puedes hacer preguntas y notas sobre tu pedido y ver las preguntas recientes.
              </p>
            </div>
            <div className="mt-8 space-y-6">
              <QuestionForm order={order} />
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Preguntas recientes</h3>
                <div className="grid gap-4">
                  {questions && questions?.length ? (
                    questions.map((question, i) => <Question key={i} question={question} />)
                  ) : (
                    <div className="text-muted-foreground">No hay preguntas</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  )
}
