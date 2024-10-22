'use client';
import React, { useEffect, useState } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ServicesList from '@/components/services/services-list';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '@/components/base/navbar';
import BackgroundImage from '@/components/base/backgroundImage';
import Footer from '@/components/base/footer';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Info } from 'lucide-react';

const HomePage: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();

    const [hasPendingServices, setHasPendingServices] = useState(true);
    const [hasReadyServices, setHasReadyServices] = useState(true);

    useEffect(() => {
        if (!user && typeof user !== 'undefined') {
            router.push('/');
        }
    }, [user, router]);

    const handleNoPendingServices = () => {
        setHasPendingServices(false);
    };

    const handleNoReadyServices = () => {
        setHasReadyServices(false);
    };

    return (
        <div className="relative w-full flex flex-col min-h-screen">
            <BackgroundImage src="/splash.webp" alt="Background" />
            <BackgroundImage src="/splash_desk.webp" alt="Background" isDesktop />

            <div className="relative z-20 flex flex-col items-center w-full flex-grow">
                <div className='flex justify-between w-full md:pr-4'>
                    <Navbar />
                </div>
                <div className='text-white flex flex-col w-full gap-4 flex-grow'>
                    <div className='flex flex-col gap-4 p-4'>
                        <h2 className='font-bold text-xl'>
                            Bem Vindo,{' '}
                            {user ? (
                                <span className='text-realce'>{user.name}</span>
                            ) : (
                                <Skeleton className="inline-block w-24 h-6 bg-gray-300 rounded-md" />
                            )}
                        </h2>
                    </div>

                    {!hasPendingServices && !hasReadyServices ? (
                        <div className="flex justify-center items-center flex-grow gap-4">
                            <Info className="text-realce" />
                            <p className="text-white text-lg">Você não tem pranchas cadastradas.</p>
                        </div>
                    ) : (
                        <>
                            <Link href='/services/status/pending'>
                                <div className='font-bold flex items-center bg-realce w-1/3 md:w-1/12 justify-between text-black py-1 rounded-r-full'>
                                    <p className='ml-4'>Pendentes</p>
                                    <ChevronRightIcon />
                                </div>
                            </Link>

                            <div className='p-4'>
                                {user ? (
                                    <ServicesList
                                        initialStatus='PENDING'
                                        exibitionMode='LIST'
                                        onEmpty={handleNoPendingServices}
                                    />
                                ) : (
                                    <Skeleton className="w-full h-40 bg-gray-300 rounded-lg" />
                                )}
                            </div>

                            <Link href='/services/status/ready'>
                                <div className='font-bold flex items-center bg-realce w-1/3 md:w-1/12 justify-between text-black py-1 rounded-r-full'>
                                    <p className='ml-4'>Prontos</p>
                                    <ChevronRightIcon />
                                </div>
                            </Link>

                            <div className='p-4'>
                                {user ? (
                                    <ServicesList
                                        initialStatus='READY'
                                        exibitionMode='LIST'
                                        onEmpty={handleNoReadyServices}
                                    />
                                ) : (
                                    <Skeleton className="w-full h-40 bg-gray-300 rounded-lg" />
                                )}
                            </div>
                        </>
                    )}
                </div>

                {(user?.role == 'MASTER' || user?.role == 'ADMIN') && (
                    <Link href={'/services/create'} className='fixed bottom-4 left-4 z-50 flex w-16 h-16 bg-realce rounded-full items-center justify-center'>
                        <AddIcon className='text-black font-bold' fontSize='large' />
                    </Link>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
