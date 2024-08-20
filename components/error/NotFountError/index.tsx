import React, { type ReactNode } from 'react'

export default function NotFoundError({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-700">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="text-lg mt-4">The page you are looking for does not exist.</p>
      {children && <div className="mt-4 flex flex-col">{children}</div>}
    </div>
  )
}
