import CooldownButton from '@/components/CooldownButton'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { getUser } from '@/db/users'
import { TOKEN_COOLDOWN_MIN } from '@/db/verificationTokens'
import { sendRecoveryEmail } from '@/utils/mailer'
import React from 'react'

export default function Page() {
  async function action(formData: FormData) {
    'use server'
    const email = formData.get('email') as string

    const user = await getUser(email)
    if (!user) return

    await sendRecoveryEmail(user)
  }

  return (
    <div className="h-screen">
      <main className="screen h-screen flex flex-col space-y-5 justify-center items-center text-black">
        <h1 className="text-lg">Recupera tu Contraseña</h1>
        <form action={action} className="w-full max-w-64 flex flex-col gap-4">
          <Label className="flex flex-col gap-1">
            Email de la Cuenta
            <Input name="email" placeholder='Email' className="font-normal" required />
          </Label>
          <p className="text-sm italic">Un email se enviara a tu casilla.</p>
          <CooldownButton cooldown={TOKEN_COOLDOWN_MIN * 60}>Enviar</CooldownButton>
        </form>
      </main>
    </div>
  )
}
