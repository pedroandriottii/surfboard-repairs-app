'use client';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/base/footer';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Surfboard } from '@/lib/types';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';

const Page: React.FC = () => {
  const pathName = usePathname();
  const id = pathName.replace('/catalogo/', '');
  const [surfboard, setSurfboard] = useState<Surfboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchSurfboard = async () => {
      try {
        const response = await fetch(`/api/marketplace/surfboards/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar a prancha de surf');
        }
        const data = await response.json();
        setSurfboard(data);
        setCurrentImage(data.coverImage);
        setImages([data.coverImage, ...data.image]);
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

  const generateWhatsappLink = (pathName: string) => {
    return `https://api.whatsapp.com/send?phone=5581988145906&text=Olá, gostaria de comprar essa prancha: painel.realcenordeste.com.br/${pathName}`;
  }

  const handleImageClick = (image: string) => {
    setCurrentImage(image);
  };

  const handleNextImage = () => {
    if (currentImage) {
      const currentIndex = images.indexOf(currentImage);
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentImage(images[nextIndex]);
    }
  };

  const handlePreviousImage = () => {
    if (currentImage) {
      const currentIndex = images.indexOf(currentImage);
      const previousIndex = (currentIndex - 1 + images.length) % images.length;
      setCurrentImage(images[previousIndex]);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!surfboard) {
    return <p className="text-white">Carregando prancha...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="p-2 flex justify-center">
        <Image
          src={'/realce_logo.png'}
          alt="Realce Surfboards"
          width={50}
          height={50}
        />
      </div>
      <div className="flex-grow">
        <div className="py-2">
          <Link href="/catalogo" className="bg-realce text-black py-1 px-6 rounded-r-2xl">
            <ArrowBackIcon />
            Voltar
          </Link>
        </div>
        <div className="p-4">
          <div className="flex flex-col items-center gap-4 relative">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePreviousImage}
                className="bg-white/80 rounded-full text-black text-center items-center justify-center align-center"
              >
                <ArrowLeftIcon fontSize="large" />
              </button>
              <div className="relative cursor-pointer" onClick={openModal}>
                <Image
                  src={currentImage || surfboard.coverImage}
                  alt={surfboard.title}
                  width={300}
                  height={300}
                  className="rounded-xl object-cover w-72 h-72"
                />
              </div>
              <button
                onClick={handleNextImage}
                className="bg-white/80 rounded-full text-black text-center items-center justify-center align-center"
              >
                <ArrowRightIcon fontSize="large" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-4">
              {images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Imagem ${index + 1} de ${surfboard.title}`}
                  width={50}
                  height={50}
                  className={`rounded-xl object-cover w-16 h-16 bg-black/80 cursor-pointer ${currentImage === image ? 'shadow-lg shadow-white/60' : 'opacity-60'}`}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-white text-2xl font-bold mt-4 text-center">
              {surfboard.title}
            </h1>
            <Badge variant="secondary">Usada</Badge>
            <p className="text-realce text-2xl font-bold">
              R$ {surfboard.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>

            <a href={generateWhatsappLink(pathName)} className="border-[1px] text-white border-white px-6 py-1 rounded-xl flex items-center gap-2">
              <WhatsAppIcon />
              <p className="">Compre agora!</p>
            </a>
          </div>
          <div className="flex flex-col p-4 gap-3">
            {surfboard.model && (
              <p className="text-white font-bold">Modelo: {surfboard.model}</p>
            )}
            {surfboard.size && (
              <p className="text-white font-bold">Tamanho: {surfboard.size}</p>
            )}
            {surfboard.volume && (
              <p className="text-white font-bold">Volume: {surfboard.volume}L</p>
            )}
            {surfboard.description && (
              <p className="text-white text-justify">
                <span className="font-bold">Descrição:</span> {surfboard.description}
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative">
            <Image
              src={currentImage || surfboard.coverImage}
              alt={surfboard.title}
              width={600}
              height={600}
              className="rounded-xl object-cover"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-realce rounded-full text-black p-1"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      </Dialog>
    </div >
  );
};

export default Page;
