'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/base/navbar';
import { ProfitChart } from '@/components/charts/profit-chart-bar';
import { Badge } from '@/components/ui/badge';
import FilterListIcon from '@mui/icons-material/FilterList';
import Cookies from 'js-cookie';
import { DeliveredServicesChart } from '@/components/charts/delivered-service-chart';
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from '@/context/UserContext';

export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  const accessToken = Cookies.get('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboards/services`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();

        const reversedData = data.reverse();

        setChartData(reversedData);
        setCurrentMonthData(reversedData[reversedData.length - 1]);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="flex flex-col p-4 gap-4">
        <Skeleton className="h-8 w-32 bg-gray-300" />
        <Skeleton className="h-48 w-full bg-gray-300" />
        <Skeleton className="h-48 w-full bg-gray-300" />
      </div>
    );
  }

  if (error) {
    return <div>Erro ao carregar os dados: {error.message}</div>;
  }

  if (user && user.role === 'MASTER') {
    return (
      <div className="flex bg-realce-bg h-full flex-col">
        <Navbar />
        <div className="text-white p-4 items-center w-full justify-between flex">
          <h1>Visão Geral dos Serviços</h1>
          <Badge className="bg-realce text-black hover:bg-white flex gap-2">
            <FilterListIcon />
            <p>Filtrar</p>
          </Badge>
        </div>
        <div className="flex flex-col p-4 gap-4 bg-realce-bg pb-10">
          <ProfitChart chartData={chartData} currentMonthData={currentMonthData} />
          <DeliveredServicesChart chartData={chartData} />
        </div>
      </div>
    );
  }

  return <div>Você não tem permissão para acessar esta página.</div>;
}