'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/Chart'
import { type getMonthlyAnalyticsByOrganizationId } from '@/db/orders'
import { type HTMLAttributes, useMemo } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { capitalizeFirstLetterOfString, cn } from '@/utils'

const chartConfig = {
  USD: {
    label: 'USD',
    color: 'hsl(var(--chart-1))'
  },
  ARS: {
    label: 'ARS',
    color: 'hsl(var(--chart-2))',
  }
} satisfies ChartConfig

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: Awaited<ReturnType<typeof getMonthlyAnalyticsByOrganizationId>>
}

export function ExpenseChart({ data, className, ...props }: Props) {
  const filledData = useMemo(() => {
    const parsedData = data.map((item) => ({
      ...item,
      year: parseInt(item.year),
      month: parseInt(item.month),
      ARS: parseInt(item.ARS),
      USD: parseInt(item.USD)
    }))

    // Sort data by year and month
    parsedData.sort((a, b) => (a.year === b.year ? a.month - b.month : a.year - b.year))

    // Get the range of years and months
    const startYear = parsedData[0]?.year
    const endYear = parsedData[parsedData.length - 1]?.year

    const result: typeof data = []
    let currentYear = startYear

    // Fill in all months from startYear to endYear
    while (currentYear <= endYear) {
      for (let month = 1; month <= 12; month++) {
        const found = parsedData.find((item) => item.year === currentYear && item.month === month)

        if (found) {
          result.push({
            year: found.year.toString(),
            month: capitalizeFirstLetterOfString(format(new Date().setMonth(found.month), 'LLLL', { locale: es })),
            ARS: found.ARS.toString(),
            USD: found.USD.toString()
          })
        } else {
          result.push({
            year: currentYear.toString(),
            month: capitalizeFirstLetterOfString(format(new Date().setMonth(month), 'LLLL', { locale: es })),
            ARS: '0',
            USD: '0'
          })
        }
      }

      currentYear++
    }

    return result
  }, [data])

  return (
    <Card className={cn('max-w-lg', className)} {...props}>
      <CardHeader>
        <CardTitle>Gastos Anuales</CardTitle>
        {/* <CardDescription>Showing total visitors for the last 6 months</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={filledData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="USD" fill="#1c9e45" />
            <Bar dataKey="ARS" fill="#38cddd" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
