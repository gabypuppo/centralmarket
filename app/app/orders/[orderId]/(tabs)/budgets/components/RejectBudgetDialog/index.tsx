'use client'
import * as Dialog from '@radix-ui/react-alert-dialog'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateBudgetsAction } from '@/utils/actions'

const REJECTION_OPTIONS = [
  'El presupuesto excede significativamente nuestro presupuesto asignado para este proyecto.',
  'Los términos y condiciones del presupuesto no son aceptables para nuestro equipo.',
  'Hemos encontrado un proveedor alternativo que se ajusta mejor a nuestras necesidades y expectativas.',
  'El presupuesto no cumple con los requisitos técnicos o específicos del proyecto.'
]

interface RejectBudgetDialogProps {
  children: React.ReactNode
  budgetId: number
}
export default function RejectBudgetDialog({ children, budgetId }: RejectBudgetDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState<string>()

  const reject = (formData: FormData) => {
    const reason = formData.get('reason') as string
    const otherReason = formData.get('order-reason') as string
    updateBudgetsAction({
      id: budgetId,
      isRejected: true,
      rejectionReason: reason !== 'Otra razón' ? reason : otherReason
    }).finally(() => {
      setIsOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md p-6 bg-white rounded-lg transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">Rechazar Presupuesto</Dialog.Title>
          <Dialog.Description className="mt-2 mb-4 text-sm text-gray-600">
            Por favor, seleccione una razón para rechazar este presupuesto:
          </Dialog.Description>

          <form action={reject} className="space-y-4">
            {REJECTION_OPTIONS.map((option, i) => (
              <label className="flex items-start text-sm" key={i}>
                <input
                  type="radio"
                  name="reason"
                  value={option}
                  onChange={(e) => setReason(e.currentTarget.value)}
                  className="mr-2 mt-1.5"
                />
                {option}
              </label>
            ))}
            <label className="flex items-center text-sm">
              <input
                type="radio"
                name="reason"
                value="Otra razón"
                className="mr-2 mt-1"
                onChange={(e) => setReason(e.currentTarget.value)}
              />
              Otra razón
            </label>

            {reason === 'Otra razón' && (
              <textarea
                name="order-reason"
                className="w-full mt-2 p-2 border rounded text-sm"
                placeholder="Por favor, especifique la razón"
              />
            )}

            <div className="mt-6 flex justify-end space-x-2">
              <Dialog.Cancel asChild>
                <Button
                  type="reset"
                  variant="secondary"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
              </Dialog.Cancel>
              <Button
                type="submit"
                variant="destructive"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Rechazar
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
