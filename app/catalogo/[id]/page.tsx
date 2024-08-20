'use client';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Surfboard {
  id: string;
  title: string;
  description: string;
  price: number;
  size: string;
  volume: number;
  coverImage: string;
  image: string[];
  branding: {
    name: string;
  };
}

const Page: React.FC = () => {
  const pathName = usePathname();
  const id = pathName.replace('/catalogo/', '');
  const [surfboard, setSurfboard] = useState<Surfboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurfboard = async () => {
      try {
        console.log(id);
        const response = await fetch(`/api/marketplace/surfboards/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar a prancha de surf');
        }
        const data = await response.json();
        setSurfboard(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido');
        }
      }
    };

    if (id) {
      fetchSurfboard();
    }
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!surfboard) {
    return <p className="text-white">Carregando prancha...</p>;
  }

  return (
    <div className='bg-black w-full h-full p-4'>
      <Image
        src={'/realce_logo.png'}
        alt='Realce Surfboards'
        width={50}
        height={50}
      />
      <div >
        <div className='flex flex-col items-center gap-4'>
          <Image
            src={surfboard.coverImage}
            alt={surfboard.title}
            width={300}
            height={300}
            className='rounded-xl object-cover w-72 h-72'
          />
          <div className='flex items-center gap-2'>
            {surfboard.image?.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Imagem ${index + 1} de ${surfboard.title}`}
                width={50}
                height={50}
                className='rounded-xl object-cover w-16 h-16 bg-black/80'
              />
            ))}
          </div>
        </div>

        <h1 className='text-white text-2xl font-bold mt-4'>{surfboard.title}</h1>
        <p className='text-white'>{surfboard.description}</p>
        <p className='text-white'>Marca: {surfboard.branding.name}</p>
        <p className='text-white'>Tamanho: {surfboard.size}L</p>
        <p className='text-white'>Volume: {surfboard.volume}L</p>
        <p className='text-white text-xl'>
          Preço: R$ {surfboard.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};

export default Page;