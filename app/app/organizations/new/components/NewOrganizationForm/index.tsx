'use client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { createOrganizationAction } from '@/utils/actions'
import { cn } from '@/utils'

interface Props extends React.HTMLAttributes<HTMLFormElement> {}

export default function OrganizationForm({ className, ...formProps }: Props) {
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [domains, setDomains] = useState<string[]>([''])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting || !name || domains.some((domain) => !domain)) return

    setIsSubmitting(true)
    try {
      await createOrganizationAction({
        name,
        domains,
      })
      router.push('./')
    } catch (error) {
      console.error('Error creating organization:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDomainChange = (index: number, value: string) => {
    const updatedDomains = [...domains]
    updatedDomains[index] = value
    setDomains(updatedDomains)
  }

  const addDomainField = () => {
    setDomains([...domains, ''])
  }

  const removeDomainField = (index: number) => {
    const updatedDomains = domains.filter((_, i) => i !== index)
    setDomains(updatedDomains)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(className, 'flex flex-col rounded p-4 shadow')}
      {...formProps}
    >
      <div className="flex flex-col gap-4">
        <label className="text-xs font-medium flex flex-col gap-2 items-start">
          Nombre de la Organización*
          <Input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="text-xs font-medium">Dominios*</label>
        {domains.map((domain, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              type="text"
              required
              value={domain}
              onChange={(e) => handleDomainChange(index, e.target.value)}
            />
            {domains.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeDomainField(index)}
                className="p-2"
              >
                -
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={addDomainField}
          className="self-start"
        >
          + Añadir Dominio
        </Button>
      </div>
      <Button type="submit" className="mt-8" disabled={isSubmitting}>
        Crear Organización
      </Button>
    </form>
  )
}
