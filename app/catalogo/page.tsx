'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Surfboards } from '@prisma/client';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/base/footer';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ChevronLeft, Sliders } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchSurfboards = async (page: number) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surfboards?page=${page}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar pranchas de surf');
        }
        const data = await response.json();
        const availableSurfboards = data.surfboards.filter((surfboard: Surfboards) => surfboard.sold === null && surfboard.is_new === false);
        setSurfboards(availableSurfboards);
        setTotalPages(data.totalPages);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido');
        }
      }
    };

    fetchSurfboards(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-realce-bg">
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
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Link>
        <h1 className='pr-4 text-white uppercase font-bold'>Pranchas Usadas</h1>
      </div>
      <div className='flex-grow mt-4'>
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

      <Pagination
        className="my-4"
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
      <Footer />
    </div>
  );
};

export default Page;
