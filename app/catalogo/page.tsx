'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Surfboards } from '@prisma/client';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/base/footer';
import TuneIcon from '@mui/icons-material/Tune';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

const Page: React.FC = () => {
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

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className='flex justify-between p-4 items-center'>
        <Image
          src={'/realce_logo.png'}
          alt='Realce Surfboards'
          width={50}
          height={50}
        />
        <h1 className='uppercase text-white'>Catálogo</h1>
      </div>
      <div className='flex items-center justify-between'>
        <Link href='/' className='bg-realce text-black py-1 px-6 rounded-r-2xl flex items-center justify-around'>
          <ArrowBackIcon />
          Voltar
        </Link>
      </div>
      <div className='flex text-white items-center p-4 justify-between'>
        <div className='flex items-center'>
          <p className='border-b-2 border-realce'>
            Pranchas Usadas
          </p>
          <ArrowDropDownIcon />
        </div>
        <Badge variant='secondary' className='flex items-center gap-2' >
          <TuneIcon />
          Filtro
        </Badge>
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
    </div>
  );
};

export default Page;
