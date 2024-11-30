'use client'
import Select from '@/components/ui/Select'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table'
import type { getOrganizationUsersOrderAnalytics } from '@/db/orders'
import { useState } from 'react'

interface Props {
  usersAnalytics: Awaited<ReturnType<typeof getOrganizationUsersOrderAnalytics>>
}

export default function UserAnalyticsTable({ usersAnalytics }: Props) {
  const [tab, setTab] = useState('expenses')

  return (
    <>
      <Select
        placeholder=""
        options={[
          {
            items: [
              { value: 'expenses', label: 'Gastos' },
              { value: 'leadtimes', label: 'Leadtimes' }
            ]
          }
        ]}
        value={tab}
        onValueChange={(value) => setTab(value)}
      />
      <Table>
        {tab === 'expenses' ? (
          <>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Gastos p/Año</TableHead>
                <TableHead>Solic. p/Año</TableHead>
                <TableHead>Gastos p/Mes</TableHead>
                <TableHead>Solic. p/Mes</TableHead>
                <TableHead>Gastos p/Semana</TableHead>
                <TableHead>Solic. p/Semana</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersAnalytics.map((userAnalytics, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <p className="font-semibold">
                      {userAnalytics.createdBy
                        ? `${userAnalytics.createdBy?.firstName} ${userAnalytics.createdBy?.lastName}`
                        : 'Usuario Desconocido'}
                    </p>
                    <p>{userAnalytics.createdBy?.email}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <p>ARS${userAnalytics.yearly.ars ?? 0}</p>
                      <p>USD${userAnalytics.yearly.usd ?? 0}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{userAnalytics.yearly.count}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <p>ARS${userAnalytics.monthly.ars ?? 0}</p>
                      <p>USD${userAnalytics.monthly.usd ?? 0}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{userAnalytics.monthly.count}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <p>ARS${userAnalytics.weekly.ars ?? 0}</p>
                      <p>USD${userAnalytics.weekly.usd ?? 0}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{userAnalytics.weekly.count}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        ) : (
          <>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Creación - Presupuestado</TableHead>
                <TableHead>Presupuestado - Aprobación</TableHead>
                <TableHead>Aprobación - Entrega</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersAnalytics.map((userAnalytics, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <p className="font-semibold">
                      {userAnalytics.createdBy
                        ? `${userAnalytics.createdBy?.firstName} ${userAnalytics.createdBy?.lastName}`
                        : 'Usuario Desconocido'}
                    </p>
                    <p>{userAnalytics.createdBy?.email}</p>
                  </TableCell>
                  <TableCell>
                    {((val = userAnalytics.leadtimes.createdToBudgetedDays) =>
                      Number.isNaN(parseInt(val))
                        ? '-'
                        : `${parseInt(val)} días ${((parseFloat(val) - parseInt(val)) * 24).toPrecision(1)} hr`)()}
                  </TableCell>
                  <TableCell>
                    {((val = userAnalytics.leadtimes.budgetedToApprovedDays) =>
                      Number.isNaN(parseInt(val))
                        ? '-'
                        : `${parseInt(val)} días ${((parseFloat(val) - parseInt(val)) * 24).toPrecision(1)} hr`)()}
                  </TableCell>
                  <TableCell>
                    {((val = userAnalytics.leadtimes.approvedToArrivedDays) =>
                      Number.isNaN(parseInt(val))
                        ? '-'
                        : `${parseInt(val)} días ${((parseFloat(val) - parseInt(val)) * 24).toPrecision(1)} hr`)()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </>
  )
}
