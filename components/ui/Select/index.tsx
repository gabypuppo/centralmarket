'use client'

import React from 'react'
import * as _Select from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons/dist'
import { cn } from '@/utils'

// Define types for the SelectComponent props
interface SelectItemProps {
  value: string
  label: string
  disabled?: boolean
}

interface SelectGroupProps {
  label?: string
  items: SelectItemProps[]
}

interface SelectProps extends _Select.SelectProps {
  placeholder: string
  options: SelectGroupProps[]
  className?: string
  ariaLabel?: string
}

const SelectItem = React.forwardRef<HTMLDivElement, _Select.SelectItemProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <_Select.Item
        {...props}
        ref={forwardedRef}
        className="flex items-center px-3 py-2 mx-2 cursor-pointer"
      >
        <_Select.ItemText>{children}</_Select.ItemText>
        <_Select.ItemIndicator className="ml-auto inline-flex items-center justify-center">
          <CheckIcon />
        </_Select.ItemIndicator>
      </_Select.Item>
    )
  }
)

SelectItem.displayName = 'SelectItem'

export default function Select({
  placeholder,
  options,
  className,
  ariaLabel,
  ...selectProps
}: SelectProps) {
  return (
    <_Select.Root {...selectProps}>
      <_Select.Trigger
        aria-label={ariaLabel}
        className={cn(
          className,
          'flex items-center justify-between px-3 py-2 border border-gray-300 rounded cursor-pointer'
        )}
      >
        <_Select.Value placeholder={placeholder} />
        <_Select.Icon className="ml-auto">
          <ChevronDownIcon />
        </_Select.Icon>
      </_Select.Trigger>
      <_Select.Portal>
        <_Select.Content className={cn(className, 'overflow-hidden bg-white rounded shadow-md')}>
          <_Select.ScrollUpButton className="flex justify-center">
            <ChevronUpIcon />
          </_Select.ScrollUpButton>
          <_Select.Viewport className="py-2">
            {options.map((group, index) => (
              <_Select.Group key={index}>
                {group.label && (
                  <_Select.Label className="px-3 py-2 text-xs text-gray-500">
                    {group.label}
                  </_Select.Label>
                )}
                {group.items.map((item) => (
                  <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
                    {item.label}
                  </SelectItem>
                ))}
                {index < options.length - 1 && (
                  <_Select.Separator className="h-px bg-gray-200 my-2" />
                )}
              </_Select.Group>
            ))}
          </_Select.Viewport>
          <_Select.ScrollDownButton className="flex justify-center">
            <ChevronDownIcon />
          </_Select.ScrollDownButton>
        </_Select.Content>
      </_Select.Portal>
    </_Select.Root>
  )
}
