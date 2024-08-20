import { signIn } from '@/auth'
import { createUser, getUser } from '@/db/users'
import Link from 'next/link'
import { RegisterForm } from './components/RegisterForm'

export default function Register() {
  async function action(formData: FormData) {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const user = await getUser(email)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string

    if (user !== null) {
      return 'Un usuario con este correo ya existe.' // TODO: Handle errors with useFormStatus
    } else {
      console.log('Creating user...')
      await createUser(email, password, firstName, lastName)
      console.log('User created!')
      await signIn('credentials', {
        redirectTo: '/app',
        email: email,
        password: password
      })
      console.log('User signed in!')
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Registrate</h3>
          <p className="text-sm text-gray-500">
            Crea una cuenta con tu mail y contraseña. Puede tardar hasta 72hs en ser aprobada.
          </p>
        </div>
        <div className="px-4 py-8 sm:px-16 space-y-4">
          <RegisterForm action={action} />
          <p className="text-center text-sm text-gray-600">
            {'¿Ya tenés una cuenta? '}
            <Link href="/auth/login" className="font-semibold text-gray-800">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
