import { signIn } from '@/auth'
import Link from 'next/link'
import { LoginForm } from './components/LoginForm'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { AuthError } from 'next-auth'

export default function Login() {
  const action = async (formData: FormData) => {
    'use server'
    try {
      return await signIn('credentials', {
        redirectTo: '/app',
        email: formData.get('email') as string,
        password: formData.get('password') as string
      })
    } catch (err) {
      if (isRedirectError(err)) {
        throw err
      }
      if (err instanceof AuthError) {
        switch (err.type) {
          case 'CredentialsSignin':
            return 'Correo o contraseña incorrecta.'
          default:
            return 'Algo salió mal.'
        }
      }
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Inicia sesión</h3>
          <p className="text-sm text-gray-500">Usa tu mail para iniciar sesión</p>
        </div>
        <div className="px-4 py-8 sm:px-16 space-y-4">
          <LoginForm action={action} />
          <p className="text-center text-sm text-gray-600">
            {'¿No tenés una cuenta? '}
            <Link href="/auth/register" className="font-semibold text-gray-800">
              Registrate
            </Link>
            {' y vamos a estar aprobando tu cuenta.'}
          </p>
        </div>
      </div>
    </div>
  )
}
