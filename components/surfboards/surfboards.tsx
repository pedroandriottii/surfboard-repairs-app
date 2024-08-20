'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Surfboards } from '@prisma/client';

function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

const SurfboardList: React.FC = () => {
  const [surfboards, setSurfboards] = useState<Surfboards[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurfboards = async () => {
      try {
        const response = await fetch('/api/marketplace/surfboards');
        if (!response.ok) {
          throw new Error('Erro ao buscar pranchas de surf');
        }
        const data = await response.json();
        setSurfboards(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido');
        }
      }
    };

    fetchSurfboards();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (surfboards.length === 0) {
    return <p className="text-gray-500">Nenhuma prancha de surf disponível.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {surfboards.map(surfboard => (
        <Card key={surfboard.id} className="shadow-md">
          <CardHeader>
            <CardTitle>{surfboard.title}</CardTitle>
            <CardDescription>{surfboard.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Tamanho: {surfboard.size}</p>
            <p>Volume: {surfboard.volume}L</p>
            <p>Preço: {formatPrice(surfboard.price)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SurfboardList;