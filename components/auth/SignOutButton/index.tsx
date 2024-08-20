import { signOut } from '@/auth'
import { Button } from '@/components/ui/Button'
export default function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <Button className="underline" type="submit">
        Cerrar sesión
      </Button>
    </form>
  )
}
