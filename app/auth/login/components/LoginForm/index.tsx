'use client'
import { Button } from '@/components/ui/Button'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface LoginFormProps {
  action: (formData: FormData) => Promise<any>
}
export function LoginForm({ action: signIn }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const action = (formData: FormData) => {
    if (isLoading) return
    setIsLoading(true)
    setError('')

    signIn(formData)
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
    <form action={action} className="flex flex-col space-y-4 bg-gray-50">
      {error && (
        <span className="text-red-600 text-xs flex items-center gap-1">
          <AlertCircle className="size-4" />
          {error}
        </span>
      )}
      <div>
        <label htmlFor="email" className="block text-xs text-gray-600 uppercase">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="user@mail.com"
          autoComplete="email"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-xs text-gray-600 uppercase">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      {error !== '' && (
        <p className="text-xs flex flex-col items-center">
          ¿Olvidaste tu contraseña?
          <Link href="/auth/recover" className="font-semibold text-gray-800">
            Recupérala aquí
          </Link>
        </p>
      )}
      <Button>Iniciar sesión</Button>
    </form>
  )
}
