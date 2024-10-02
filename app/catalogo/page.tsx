'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Surfboards } from '@prisma/client';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/base/footer';
import TuneIcon from '@mui/icons-material/Tune';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

const Page: React.FC = () => {
  const [surfboards, setSurfboards] = useState<Surfboards[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);

  useEffect(() => {
    const fetchSurfboards = async () => {
      try {
        const response = await fetch('/api/marketplace/surfboards?is_new=false');
        if (!response.ok) {
          throw new Error('Erro ao buscar pranchas de surf');
        }
        const data = await response.json();
        const availableSurfboards = data.filter((surfboard: Surfboards) => surfboard.sold === null && surfboard.is_new === false);
        setSurfboards(availableSurfboards);
        const maxPrice = Math.max(...availableSurfboards.map((surfboard: Surfboards) => surfboard.price));
        setMaxPrice(maxPrice);
        setSelectedPrice(maxPrice);
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

  const handleSliderChange = (value: number[]) => {
    setSelectedPrice(value[0]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className='flex justify-center p-2'>
        <Image
          src={'/realce_logo.png'}
          alt='Realce Surfboards'
          width={50}
          height={50}
        />
      </div>
      <div className='flex items-center justify-between'>
        <Link href='/' className='bg-realce text-black py-1 px-6 rounded-r-2xl flex items-center justify-around'>
          <ArrowBackIcon />
          Voltar
        </Link>
      </div>
      <div className='flex text-white items-center p-4 justify-between'>
        <p className='border-b-[1px] border-realce'>Pranchas Usadas</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Badge variant='secondary' className='flex items-center gap-2 cursor-pointer'>
              <TuneIcon />
              Filtro
            </Badge>
          </AlertDialogTrigger>
          <AlertDialogContent className='bg-black text-white'>
            <AlertDialogHeader>
              <AlertDialogTitle>Filtrar por Preço</AlertDialogTitle>
              <AlertDialogDescription>
                Ajuste o valor máximo para filtrar as pranchas de surf disponíveis.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col items-center gap-4">
              <Slider
                value={[selectedPrice]}
                max={maxPrice}
                step={50}
                onValueChange={handleSliderChange}
                className=''
              />
              <p className='text-realce'>{formatPrice(selectedPrice)}</p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button className='text-black bg-realce'>Filtrar</Button>
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className='flex-grow'>
        {error ? (
          <p className='text-red-500'>{error}</p>
        ) : surfboards.length > 0 ? (
          surfboards.map(surfboard => (
            <Link href={`/catalogo/${surfboard.id}`} key={surfboard.id} className='text-white p-4 flex gap-4 border-b-2 border-[#2F2F2F] mb-2'>
              <Image
                src={surfboard.coverImage}
                alt={surfboard.title}
                width={140}
                height={140}
                className='rounded-xl object-cover w-36 h-36'
              />
              <div className='flex flex-col justify-between'>
                <h2 className='font-bold'>{surfboard.title}</h2>
                {surfboard.model && (
                  <p className='text-sm'>Modelo: {surfboard.model}</p>
                )}
                {surfboard.size && (
                  <p className='text-sm'>Tamanho: {surfboard.size}</p>
                )}
                {surfboard.volume && (
                  <p className='text-sm'>Volume: {surfboard.volume}L</p>
                )}
                <p className='text-xl text-realce'>{formatPrice(surfboard.price)}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className='text-white'>Nenhuma prancha encontrada.</p>
        )}
      </div>
      <Footer />
    </div >
  );
};

export default Page;