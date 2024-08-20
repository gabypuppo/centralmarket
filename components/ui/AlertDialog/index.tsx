'use client'

import { type ReactNode, useState } from 'react'
import { Button } from '../Button'

interface Props {
  children: ReactNode
  message: string
  onConfirm: () => Promise<void>
  onDismiss?: () => void
  confirmText?: string
  dismissText?: string
}

export default function AlertDialog({
  children,
  message,
  onConfirm,
  onDismiss,
  confirmText = 'OK',
  dismissText = 'Cancel'
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = () => {
    if (isConfirming) return
    setIsConfirming(true)

    onConfirm().finally(() => {
      setIsConfirming(false)
      setIsOpen(false)
    })
  }

  const handleDismiss = () => {
    onDismiss && onDismiss()
    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full" variant="destructive" size="icon">
        {children}
      </Button>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <p className="mb-4">{message}</p>
            <div className="flex justify-end space-x-4">
              {onDismiss && (
                <Button variant="ghost" onClick={handleDismiss}>
                  {dismissText}
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={handleConfirm}
                type="submit"
                disabled={isConfirming}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
