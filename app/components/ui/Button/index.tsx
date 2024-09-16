import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: 'default' | 'register'
}

const variantStyles = {
  default: 'bg-[#19A863]',
  register: 'py-2.5 bg-white text-[#19A863] border border-[#19A863]'
}

export default function Button({
  variant = 'default',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={twMerge('px-8 py-4 rounded-md', variantStyles[variant], className)} {...props}>
      {children}
    </button>
  )
}
