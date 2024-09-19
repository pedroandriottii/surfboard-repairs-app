'use client';
import React from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ServicesList from '@/components/services/services-list';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '@/components/base/navbar';
import BackgroundImage from '@/components/base/backgroundImage';
import Footer from '@/components/base/footer';
import { getCurrentUser } from '@/utils/getCurrentUser';

const HomePage: React.FC = () => {
    const user = getCurrentUser();
    return (
        <div className="relative w-full flex flex-col min-h-screen overflow-x-hidden">
            <BackgroundImage src="/splash.webp" alt="Background" />
            <BackgroundImage src="/splash_desk.webp" alt="Background" isDesktop />
            <div className="relative z-20 flex flex-col items-center w-full flex-grow">
                <div className='flex justify-between w-full md:pr-4'>
                    <Navbar />
                </div>
                <div className='text-white flex flex-col w-full gap-4 flex-grow'>
                    <div className='flex flex-col gap-4 p-4'>
                        <h2 className='font-bold text-xl'>Bem Vindo, {user?.name}<span className='text-realce'></span></h2>
                    </div>
                    <Link href='/home/pending'>
                        <div className='font-bold flex items-center bg-realce w-1/3 md:w-1/12 justify-between text-black py-1 rounded-r-full hover:w-1/3 hover:transition-all'>
                            <p className='ml-4'>Pendentes</p>
                            <ChevronRightIcon />
                        </div>
                    </Link>
                    <div className='p-4'>
                        <ServicesList initialStatus='PENDING' exibitionMode='LIST' />
                    </div>
                    <Link href='/home/ready'>
                        <div className='font-bold flex items-center bg-realce w-1/3 md:w-1/12 justify-between text-black py-1 rounded-r-full hover:w-1/3 hover:transition-all'>
                            <p className='ml-4'>Prontos</p>
                            <ChevronRightIcon />
                        </div>
                    </Link>
                    <div className='p-4'>
                        <ServicesList initialStatus='READY' exibitionMode='LIST' />
                    </div>
                </div>
                {(user?.role == 'MASTER' || user?.role == 'ADMIN') && (
                    <Link href={'/services/create'} className='fixed bottom-4 left-4 z-50 flex w-16 h-16 bg-realce rounded-full items-center justify-center'>
                        <AddIcon className='text-black font-bold' fontSize='large' />
                    </Link>
                )}
            </div>
            <div className='relative z-10 flex flex-col items-center w-full flex-grow'>
                <Footer />
            </div>
        </div>
    )
};

export default HomePage;
