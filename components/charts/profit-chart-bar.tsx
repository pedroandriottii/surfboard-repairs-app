"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  monthlyProfit: {
    label: "Faturado",
    color: "hsl(var(--chart-2))",
  },
  valuesToReceive: {
    label: "A Receber",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ProfitChartProps {
  chartData: Array<{ month: string; monthlyProfit: number; valuesToReceive: number }>;
  currentMonthData: { month: string; monthlyProfit: number; totalServices: number } | null;
}

function getMonthName(monthNumber: number): string {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('pt-BR', { month: 'long' });
}

export function ProfitChart({ chartData, currentMonthData }: ProfitChartProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Card>
          <CardHeader>
            <CardTitle>Vendas</CardTitle>
            <CardDescription>
              {currentMonthData ? getMonthName(Number(currentMonthData.month)) : "Carregando..."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-uppercase text-xl">
            {currentMonthData
              ? `R$ ${currentMonthData.monthlyProfit.toFixed(2)}`
              : "Carregando..."}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Serviços Abertos</CardTitle>
            <CardDescription>
              {currentMonthData ? getMonthName(Number(currentMonthData.month)) : "Carregando..."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xl uppercase">
            {currentMonthData
              ? `${currentMonthData.totalServices} serviços`
              : "Carregando..."}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Faturamento (R$)</CardTitle>
            <CardDescription>
              Mostrando valores recebidos e a receber nos últimos 4 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                width={600}
                height={300}
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => getMonthName(Number(value))}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Legend />
                <Bar
                  dataKey="monthlyProfit"
                  fill={chartConfig.monthlyProfit.color}
                  radius={4}
                  name="Recebido"
                />
                <Bar
                  dataKey="valuesToReceive"
                  fill={chartConfig.valuesToReceive.color}
                  radius={4}
                  name="A Receber"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
