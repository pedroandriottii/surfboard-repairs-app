'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Surfboards } from '@prisma/client';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import TuneIcon from '@mui/icons-material/Tune';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/base/navbar';
import AddIcon from '@mui/icons-material/Add';
import { RoleGate } from '@/components/auth/role-gate';
import { Switch } from '@/components/ui/switch';

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
  const [showSold, setShowSold] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const ITEMS_PER_LOAD = 7;
  const [loadedSurfboards, setLoadedSurfboards] = useState<Surfboards[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const fetchSurfboards = async () => {
      try {
        const response = await fetch('/api/marketplace/surfboards?is_new=false');
        if (!response.ok) {
          throw new Error('Erro ao buscar pranchas de surf');
        }
        const data = await response.json();
        setSurfboards(data);
        const maxPrice = Math.max(...data.map((surfboard: Surfboards) => surfboard.price));
        setMaxPrice(maxPrice);
        setSelectedPrice(maxPrice);
        setLoadedSurfboards(data.slice(0, ITEMS_PER_LOAD));
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMore) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadedSurfboards, hasMore]);

  const loadMore = () => {
    const nextSurfboards = surfboards.slice(
      loadedSurfboards.length,
      loadedSurfboards.length + ITEMS_PER_LOAD
    );
    if (nextSurfboards.length > 0) {
      setLoadedSurfboards([...loadedSurfboards, ...nextSurfboards]);
    } else {
      setHasMore(false);
    }
  };

  if (!isMounted) return null;

  const handleSliderChange = (value: number[]) => {
    setSelectedPrice(value[0]);
  };

  const filteredSurfboards = loadedSurfboards.filter(surfboard =>
    showSold ? surfboard.sold !== null : surfboard.sold === null && surfboard.price <= selectedPrice
  );

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <RoleGate allowedRoles={['ADMIN', 'MASTER']}>
        <div className='flex items-center justify-between pr-4'>
          <Link href='/home' className='bg-realce text-black py-1 px-6 rounded-r-2xl flex items-center justify-around'>
            <ArrowBackIcon />
            Voltar
          </Link>
          <div className="flex items-center gap-2">
            <p className="text-white">Mostrar Vendidas</p>
            <Switch checked={showSold} onCheckedChange={(checked) => setShowSold(checked)} />
          </div>
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
          ) : filteredSurfboards.length > 0 ? (
            filteredSurfboards.map((surfboard, index) => (
              <Link href={`/home/marketplace/${surfboard.id}`} key={surfboard.id} className="text-white p-4 flex gap-4 border-b-2 border-[#2F2F2F] mb-2">
                <Image
                  src={surfboard.coverImage}
                  alt={surfboard.title}
                  width={140}
                  height={140}
                  className="rounded-xl object-cover w-36 h-36"
                  sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
                />
                <div className="flex flex-col justify-between">
                  <h2 className="font-bold">{surfboard.title}</h2>
                  {surfboard.model && <p className="text-sm">Modelo: {surfboard.model}</p>}
                  {surfboard.size && <p className="text-sm">Tamanho: {surfboard.size}</p>}
                  {surfboard.volume && <p className="text-sm">Volume: {surfboard.volume}L</p>}
                  <p className="text-xl text-realce">{formatPrice(surfboard.price)}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-white">Nenhuma prancha encontrada.</p>
          )}
        </div>
        <Link href={'/home/marketplace/create'} className='fixed bottom-4 left-4 z-50 flex w-16 h-16 bg-realce rounded-full items-center justify-center'>
          <AddIcon className='text-black font-bold' fontSize='large' />
        </Link>
      </RoleGate>
    </div>
  );
};

export default Page;