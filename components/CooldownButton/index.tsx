'use client'
import React, { type ComponentPropsWithRef, useState } from 'react'
import { Button } from '../ui/Button'

type CooldownButtonProps = {
  cooldown: number
} & ComponentPropsWithRef<typeof Button>

const CooldownButton = React.forwardRef<HTMLButtonElement, CooldownButtonProps>(
  ({ cooldown: _cooldown, children, onClick, ...props }, ref) => {
    const [cooldown, setCooldown] = useState(0)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (cooldown > 0) {
        e.preventDefault()
        return
      }

      setCooldown(_cooldown)
      const parent = e.currentTarget.parentElement
      if (parent instanceof HTMLFormElement) {
        parent.requestSubmit()
      }

      let timer = setInterval(() => {
        setCooldown((time) => {
          if (time === 0) {
            clearInterval(timer)
            return 0
          } else return time - 1
        })
      }, 1000)

      if (onClick) onClick(e)
    }

    return (
      <>
        <Button ref={ref} {...props} onClick={(e) => handleClick(e)} disabled={cooldown > 0}>
          {children}
        </Button>
        {cooldown > 0 && (
          <p className="text-sm">
            Vuelve a intentar en {`${Math.floor(cooldown / 60)}`.padStart(2, '0')}:
            {`${cooldown % 60}`.padStart(2, '0')}
          </p>
        )}
      </>
    )
  }
)
CooldownButton.displayName = 'CooldownButton'
export default CooldownButton
