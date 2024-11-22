'use client'
import Select from '@/components/ui/Select'
import { type OrderCategory } from '@/db/orders'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface CategorySelectProps {
  categories: OrderCategory[]
}
export default function CategorySelect({ categories }: CategorySelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState<string>('0')
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleSearch = useCallback(
    (term: string): void => {
      const newTimeoutId = setTimeout(() => {
        const params = new URLSearchParams(window.location.search)
        if (term && term !== '0') {
          params.set('categoryId', term)
        } else {
          params.delete('categoryId')
        }
        params.delete('page')

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      }, 100)

      setTimeoutId(newTimeoutId)
    },
    [pathname, router]
  )
  
  useEffect(() => {
    handleSearch(searchTerm)
  }, [searchTerm, handleSearch])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const search = params.get('categoryId')
    if (search) {
      setSearchTerm(search)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])


  return (
    <Select
      placeholder="Categoría"
      options={[
        {
          items: [
            { value: '0', label: 'Todas las Categorías' },
            ...categories.map((category) => ({
              value: category.id.toString(),
              label: category.name ?? ''
            }))
          ]
        }
      ]}
      value={searchTerm}
      onValueChange={(value) => setSearchTerm(value)}
    />
  )
}
