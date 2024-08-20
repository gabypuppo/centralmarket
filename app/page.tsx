import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Link href="/app" className="text-stone-400 underline hover:text-stone-200 transition-all">
        Login
      </Link>
    </div>
  )
}
