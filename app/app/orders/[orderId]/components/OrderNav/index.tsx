import { auth } from '@/auth'
import React from 'react'
import StyledLink from './styledLink'

export default async function OrderNav() {
  const session = await auth()
  const isBuyer = session?.user.organizationId === 1

  return (
    <nav className={`h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full ${isBuyer ? 'grid-cols-7' : 'grid-cols-6'}`}>
      {isBuyer && <StyledLink href="actions">Acciones</StyledLink>}
      <StyledLink href="details">Detalles</StyledLink>
      <StyledLink href="products">Productos</StyledLink>
      <StyledLink href="budgets">Presupuestos</StyledLink>
      <StyledLink href="files">Archivos</StyledLink>
      <StyledLink href="questions">Preguntas</StyledLink>
      <StyledLink href="history">Historial</StyledLink>
    </nav>
  )
}
