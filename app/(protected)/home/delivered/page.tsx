"use client";
import React from 'react';
import ServicesList from '@/components/services/services-list';
import { useCurrentRole } from '@/hooks/use-current-role';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Navbar from '@/components/base/navbar';
import BackgroundImage from '@/components/base/backgroundImage';
import Footer from '@/components/base/footer';

const GridPage: React.FC = () => {
    const role = useCurrentRole();
    return (
        <div className="min-h-screen flex flex-col justify-between overflow-x-hidden">
            <BackgroundImage src="/splash.png" alt="Background" />
            <BackgroundImage src="/splash_desk.png" alt="Background" isDesktop />
            <div className="relative z-20 flex flex-col items-center flex-grow">
                <div className='flex justify-between w-full'>
                    <Navbar role={role} />
                </div>
                <div className='text-white flex flex-col w-full gap-4 h-full'>
                    <div className='flex items-center w-full justify-between'>
                        <Link href={'/home'}>
                            <Button className='bg-realce max-h-8 text-black font-bold rounded-l-none rounded-r-xl text-xl hover:bg-white hover:text-black'>
                                <ChevronLeftIcon />
                                <p className='md:hidden'>Entregues</p>
                                <p className='hidden md:block'>Voltar</p>
                            </Button>
                        </Link>
                        <div className='flex gap-4 mr-4'>
                            <Link href={'/home/ready'}>
                                <Button className='bg-transparent border-2 border-realce text-realce rounded-xl max-h-8 hover:bg-white hover:text-black'>Prontos</Button>
                            </Link>
                            <Link href={'/home/pending'}>
                                <Button className='bg-transparent border-2 border-realce text-realce rounded-xl max-h-8 hover:bg-white hover:text-black'>Pendentes</Button>
                            </Link>
                            <Link href={'/home/delivered'}>
                                <Button className='bg-realce text-black rounded-xl max-h-8 hover:bg-white hover:text-black hidden md:block'>Entregues</Button>
                            </Link>
                        </div>
                    </div>
                    <ServicesList initialStatus='DELIVERED' exibitionMode='GRID' />
                    <div className='p-4'>
                    </div>
                </div>
            </div>
            <span className='inset-0 z-10'>
                <Footer />
            </span>
        </div>
    )
};

export default GridPage;