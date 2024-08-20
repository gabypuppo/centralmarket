import React, { type ReactNode } from 'react'

export default function UnauthorizedError({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-700">
      <h1 className="text-4xl font-bold">403 - Unauthorized</h1>
      <p className="text-lg mt-4">You do not have permission to access this page.</p>
      {children && <div className="mt-4 flex flex-col">{children}</div>}
    </div>
  )
}
