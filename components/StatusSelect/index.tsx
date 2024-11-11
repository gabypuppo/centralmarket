'use client'

import Select from '@/components/ui/Select'
import { OrderStatusEnum } from '@/utils/enums'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getFormattedLabel } from '../../app/app/orders/utils'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
  id?: number | string
}

export default function StatusSelect({ id }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<string>('')
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

  const keys = useMemo(() => {
    return (Object.keys(OrderStatusEnum) as OrderStatus[]).filter((key) =>
      Number.isNaN(parseInt(key))
    )
  }, [])

  const handleSearch = useCallback(
    (value: string): void => {
      const newTimeoutId = setTimeout(() => {
        const params = new URLSearchParams(window.location.search)
        if (value && value !== 'ANY') {
          params.set(`status${id ?? ''}`, value)
        } else {
          params.delete(`status${id ?? ''}`)
        }
        params.delete('page')

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      }, 100)

      setTimeoutId(newTimeoutId)
    },
    [pathname, router, id]
  )
  
  useEffect(() => {
    // check if param exist and set in search term
    const params = new URLSearchParams(window.location.search)
    const search = params.get(`status${id ?? ''}`)
    if (search) {
      setStatus(search)
    }
  }, [id])

  useEffect(() => {
    handleSearch(status)
  }, [status, handleSearch])

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])


  return (
    <Select
      placeholder="Estado"
      options={[
        {
          items: [
            {
              value: 'ANY',
              label: 'Cualquiera'
            },
            ...keys.map((key) => ({
              value: key,
              label: getFormattedLabel(key)
            }))
          ]
        }
      ]}
      onValueChange={(value) => setStatus(value)}
      value={status}

    />
  )
}
