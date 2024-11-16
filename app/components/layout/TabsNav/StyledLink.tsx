'use client'
import { cn } from '@/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { forwardRef } from 'react'
import type { ComponentPropsWithRef } from 'react'

// Define the props type for the StyledLink component
type StyledLinkProps = ComponentPropsWithRef<typeof Link>

// Forward the ref to the Link component
const StyledLink = forwardRef<HTMLAnchorElement, StyledLinkProps>(
  ({ children, className, href, ...props }, ref) => {
    const pathname = usePathname()
    const page = pathname.split('/').at(-1)
    const isActive = page === href

    return (
      <Link
        ref={ref}
        href={href}
        data-state={isActive ? 'active' : 'inactive'}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </Link>
    )
  }
)
StyledLink.displayName = Link.displayName

export default StyledLink