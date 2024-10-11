'use client';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '@/components/base/navbar';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Surfboard } from '@/lib/types';
import { RoleGate } from '@/components/auth/role-gate';
import { Input } from '@/components/ui/input';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';

const Page: React.FC = () => {
    const pathName = usePathname();
    const id = pathName.replace('/home/marketplace/', '');
    const [surfboard, setSurfboard] = useState<Surfboard | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const role = useCurrentRole();
    const router = useRouter();

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
                setPrice(data.price);
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

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/marketplace/surfboards/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Erro ao deletar a prancha de surf');
            }
            router.push('/home/marketplace');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Erro desconhecido');
            }
        }
    };

    const handleMarkAsSold = async () => {
        try {
            const response = await fetch(`/api/marketplace/surfboards/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ price }),
            });
            if (!response.ok) {
                throw new Error('Erro ao marcar a prancha como vendida');
            }
            router.push('/home/marketplace');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Erro desconhecido');
            }
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
            <Navbar />
            <RoleGate allowedRoles={['MASTER', 'ADMIN']}>
                <div className="flex-grow">
                    <div className="py-2">
                        <Link href="/home/marketplace" className="bg-realce text-black py-1 px-6 rounded-r-2xl">
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
                            {surfboard.sold && (
                                <Badge className='text-center flex justify-center' variant="destructive">Vendida em {new Date(surfboard.sold).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                                </Badge>
                            )}
                        </div>
                        <div>
                            {role === 'MASTER' && (
                                <div className="flex justify-between px-4 mb-20">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant='destructive' className="bg-red-600 text-white py-2 px-4 rounded-lg">
                                                Deletar Prancha
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirmação de Exclusão</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tem certeza que deseja deletar esta prancha? Esta ação não pode ser desfeita.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDelete}>
                                                    Deletar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    {!surfboard.sold && (

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant='secondary' className="bg-green-600 text-white py-2 px-4 rounded-lg">
                                                    Prancha Vendida
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Confirmação de Venda</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Confirme o preço da venda. O preço atual da prancha está pré-preenchido, mas você pode alterar se necessário.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <div className="px-4 py-2">
                                                    <Input
                                                        type="number"
                                                        value={price}
                                                        onChange={(e) => setPrice(Number(e.target.value))}
                                                        className="w-full"
                                                        placeholder="Preço de venda"
                                                    />
                                                </div>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleMarkAsSold}>
                                                        Confirmar Venda
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </RoleGate>

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
        </div>
    );
};

export default Page;
