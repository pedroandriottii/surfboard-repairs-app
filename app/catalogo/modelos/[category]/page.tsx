'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Surfboards } from '@prisma/client';
import Footer from '@/components/base/footer';
import { Badge } from '@/components/ui/badge';
import MarketplaceNavbar from '@/components/base/marketplaceNavbar';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

const CategoryPage: React.FC = () => {
  const [surfboards, setSurfboards] = useState<Surfboards[]>([]);
  const [error, setError] = useState<string | null>(null);
  const pathName = usePathname();
  const category = pathName.split('/').pop();

  useEffect(() => {
    if (category) {
      const fetchSurfboardsByCategory = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surfboards/category/${category}`);
          if (!response.ok) {
            throw new Error('Erro ao buscar pranchas de surf por categoria');
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

      fetchSurfboardsByCategory();
    }
  }, [category]);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <h1 className='text-realce text-center mt-8 font-bold uppercase'>{category}</h1>
      <MarketplaceNavbar />
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
          <p className='text-white'>Nenhuma prancha encontrada para a categoria {category}.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;