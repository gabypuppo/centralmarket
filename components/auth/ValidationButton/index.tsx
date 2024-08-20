

'use client'
import { Button } from '@/components/ui/Button'
import type { Order } from '@/db/orders'
import type { User } from '@/db/users'
import { sendMailValidationAction } from '@/utils/actions'
import { type FormEvent, useState } from 'react'

export default function ValidationButton({ user }: { user: User, orderData?: Order }) {
  const [cooldown, setCooldown] = useState(0)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCooldown(120)
    if (!user.id || !user.email) return
    await sendMailValidationAction(user.id, user.email, user.firstName ?? '')
    let timer = setInterval(() => {
      setCooldown((time) => {
        if (time === 0) {
          clearInterval(timer)
          return 0
        } else return time - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <Button type="submit" className="underline" disabled={cooldown > 0}>
        Enviar correo de validación
      </Button>
      {cooldown > 0 && (
        <p className="text-sm text-center">
          Proba devuelta en {`${Math.floor(cooldown / 60)}`.padStart(2, '0')}:
          {`${cooldown % 60}`.padStart(2, '0')}
        </p>
      )}
    </form>
  )
}