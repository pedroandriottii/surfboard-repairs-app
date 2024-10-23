"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingDown, TrendingUp } from "lucide-react";

const chartConfig = {
  deliveredCount: {
    label: "Pranchas Entregues",
    color: "hsl(var(--chart-1))",
    icon: TrendingDown,
  },
  pendingCount: {
    label: "Pranchas Pendentes",
    color: "hsl(var(--chart-2))",
    icon: TrendingUp,
  },
};

interface ChartData {
  month: string;
  deliveredCount: number;
  pendingCount: number;
}

export function DeliveredServicesChart({ chartData }: { chartData: ChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume de Serviços</CardTitle>
        <CardDescription>
          Mostrando as pranchas entregues e pendentes dos últimos 4 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            width={600}
            height={300}
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
                return monthNames[value - 1];
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="deliveredCount"
              type="natural"
              fill={chartConfig.deliveredCount.color}
              fillOpacity={0.4}
              stroke={chartConfig.deliveredCount.color}
              stackId="a"
            />
            <Area
              dataKey="pendingCount"
              type="natural"
              fill={chartConfig.pendingCount.color}
              fillOpacity={0.4}
              stroke={chartConfig.pendingCount.color}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
