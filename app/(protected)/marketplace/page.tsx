'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Surfboards } from '@prisma/client';
import Link from 'next/link';
import Navbar from '@/components/base/navbar';
import { useUser } from '@/context/UserContext';
import { Switch } from '@/components/ui/switch';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ChevronLeft, Info, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

const generatePageNumbers = (currentPage: number, totalPages: number) => {
  const pageNumbers: (number | string)[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) pageNumbers.push("...");
    pageNumbers.push(totalPages);
  }

  return pageNumbers;
};

const Page: React.FC = () => {
  const [surfboards, setSurfboards] = useState<Surfboards[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSold, setShowSold] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useUser();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchSurfboards = async (page: number) => {
      setIsLoading(true);
      try {
        const url = showSold
          ? `${process.env.NEXT_PUBLIC_API_URL}/surfboards/sold?page=${page}`
          : `${process.env.NEXT_PUBLIC_API_URL}/surfboards?page=${page}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erro ao buscar pranchas de surf');
        }
        const data = await response.json();
        setSurfboards(data.surfboards);
        setTotalPages(data.totalPages);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurfboards(currentPage);
  }, [showSold, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-realce-bg">
      <Navbar />
      {user?.role === 'ADMIN' || user?.role === 'MASTER' ? (
        <>
          <div className='flex items-center justify-between pr-4'>
            <Link href='/home' className='bg-realce text-black py-1 px-6 rounded-r-2xl flex items-center justify-around'>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
            <div className="flex items-center gap-2">
              <p className="text-white">Mostrar Vendidas</p>
              <Switch checked={showSold} onCheckedChange={(checked) => setShowSold(checked)} />
            </div>
          </div>

          <div className='flex-grow mt-4'>
            {error ? (
              <p className='text-red-500'>{error}</p>
            ) : isLoading ? (
              <div className='flex flex-col gap-4 p-4'>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className='h-36 w-full rounded-lg' />
                ))}
              </div>
            ) : surfboards && surfboards.length > 0 ? (
              surfboards.map((surfboard) => (
                <Link href={`/marketplace/${surfboard.id}`} key={surfboard.id} className="text-white p-4 flex gap-4 border-b-2 border-[#2F2F2F] mb-2">
                  <Image
                    src={surfboard.coverImage}
                    alt={surfboard.title}
                    width={140}
                    height={140}
                    className="rounded-xl object-cover w-36 h-36"
                    sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw" />
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
              <div className='flex items-center gap-4 p-4'>
                <Info className='text-realce' />
                <p className="text-white">Nenhuma prancha encontrada</p>
              </div>
            )}
          </div>

          <Pagination
            className="my-4 mb-28"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          >
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {generatePageNumbers(currentPage, totalPages).map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <span className="text-muted-foreground px-2">...</span>
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={() => handlePageChange(Number(page))}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <Link href={'/marketplace/create'} className='fixed bottom-4 left-4 z-50 flex w-16 h-16 bg-realce rounded-full items-center justify-center'>
            <Plus className='text-black font-bold h-6 w-6' />
          </Link>
        </>
      ) : null}
    </div>
  );
};

export default Page;
