'use client'
import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/Input'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
  id?: number | string
}

function SearchBar({ id }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleSearch = useCallback(
    (term: string): void => {
      const newTimeoutId = setTimeout(() => {
        const params = new URLSearchParams(window.location.search)
        if (term) {
          params.set(`search${id ?? ''}`, term)
        } else {
          params.delete(`search${id ?? ''}`)
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
    const search = params.get(`search${id ?? ''}`)
    if (search) {
      setSearchTerm(search)
    }
  }, [id])

  useEffect(() => {
    handleSearch(searchTerm)
  }, [searchTerm, handleSearch])

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  // TO DO - Improve loading visualization.

  return (
    <div className="flex flex-1 flex-col md:flex-col md:items-center gap-2 md:gap-4">
      <Input
        type="search"
        placeholder="Search..."
        className="bg-background md:flex-1"
        spellCheck="false"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyUp={() => handleSearch(searchTerm)}
      />
    </div>
  )
}

export default SearchBar
