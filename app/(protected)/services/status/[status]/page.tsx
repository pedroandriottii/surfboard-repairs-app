"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ServicesList from '@/components/services/services-list';
import Navbar from '@/components/base/navbar';
import Footer from '@/components/base/footer';
import BackgroundImage from '@/components/base/backgroundImage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import StatusSelector from '@/components/services/statusSelector';
import { ServiceStatus } from '@prisma/client';

const StatusPage: React.FC = () => {
    const pathname = usePathname();
    const status = pathname.split('/').pop()

    const getServiceStatus = (status: string | string[] | undefined): ServiceStatus => {
        switch (status) {
            case 'ready':
                return ServiceStatus.READY;
            case 'delivered':
                return ServiceStatus.DELIVERED;
            case 'pending':
            default:
                return ServiceStatus.PENDING;
        }
    };

    const formattedStatus = getServiceStatus(status as string);

    return (
        <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
            <BackgroundImage src="/splash.webp" alt="Background" />
            <BackgroundImage src="/splash_desk.webp" alt="Background" isDesktop />
            <div className="relative z-20 flex flex-col items-center flex-grow">
                <div className='flex justify-between w-full'>
                    <Navbar />
                </div>
                <div className='text-white flex flex-col w-full gap-4 h-full'>
                    <div className='flex items-center w-full justify-between'>
                        <Link href={'/home'}>
                            <Button className='bg-realce max-h-8 text-black font-bold rounded-l-none rounded-r-xl text-xl hover:bg-white hover:text-black'>
                                <ChevronLeftIcon />
                                <p className='md:hidden'>Voltar</p>
                                <p className='hidden md:block'>Voltar</p>
                            </Button>
                        </Link>
                        <StatusSelector currentStatus={status as string} />
                    </div>
                    <div className='p-4'>
                        <ServicesList initialStatus={formattedStatus} exibitionMode='GRID' />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default StatusPage;
