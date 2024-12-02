'use client'
import type { FC } from 'react'
import { useState, useEffect, useCallback } from 'react'

interface Props {
  action: () => Promise<any>
}


const Spinner: FC = () => (
  <div className="flex flex-1 h-full w-full items-center justify-center py-1">
    <svg
      className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
)

export function PunchoutLoginForm({ action: signIn }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [, setError] = useState('')

  const action = useCallback(() => {
    if (isLoading) return
    setIsLoading(true)
    setError('')

    signIn()
      .then((res) => {
        if (typeof res === 'string') {
          setError(res)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setIsLoading(false))
  }, [signIn])

  useEffect(() => {
    action()
  }, [action])

  return (<Spinner />)
}
