"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A stacked area chart for daily open and delivered repairs"

const chartData = [
  { day: "01", openRepairs: 5, deliveredRepairs: 2 },
  { day: "02", openRepairs: 3, deliveredRepairs: 4 },
  { day: "03", openRepairs: 8, deliveredRepairs: 1 },
  { day: "04", openRepairs: 6, deliveredRepairs: 3 },
]

const chartConfig = {
  openRepairs: {
    label: "Open Repairs",
    color: "hsl(var(--chart-1))",
  },
  deliveredRepairs: {
    label: "Delivered Repairs",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Component({ data }: { data: typeof chartData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Daily Repairs</CardTitle>
        <CardDescription>
          Showing open and delivered repairs for the selected month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `Dia ${value}`}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="openRepairs"
              type="natural"
              fill="var(--color-openRepairs)"
              fillOpacity={0.4}
              stroke="var(--color-openRepairs)"
              stackId="a"
            />
            <Area
              dataKey="deliveredRepairs"
              type="natural"
              fill="var(--color-deliveredRepairs)"
              fillOpacity={0.4}
              stroke="var(--color-deliveredRepairs)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              For the selected month
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}