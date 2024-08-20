'use client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { AlertCircle } from 'lucide-react'
import React, { useState } from 'react'

interface ChangePasswordFormProps {
  action: (formData: FormData) => Promise<void | string>
}
export default function ChangePasswordForm({ action: changePassword }: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const action = (formData: FormData) => {
    if (isLoading) return
    setIsLoading(true)
    setError('')

    changePassword(formData)
      .then((res) => {
        if (typeof res === 'string') {
          setError(res)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form action={action} className="w-full max-w-64 flex flex-col gap-4">
      {error && (
        <span className="text-red-600 text-xs flex items-center gap-1">
          <AlertCircle className="size-4" />
          {error}
        </span>
      )}
      <Label className="flex flex-col gap-1 text-xs">
        Nueva Contraseña
        <Input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="font-normal"
          required
        />
      </Label>
      <Label className="flex flex-col gap-1 text-xs">
        Repite la Contraseña
        <Input
          name="repeat-password"
          type="password"
          placeholder="Contraseña"
          className="font-normal"
          required
        />
      </Label>
      <Button>Cambiar Contraseña</Button>
    </form>
  )
}
