"use client";
import React from 'react';
import Link from 'next/link';
import TopServicesList from '@/components/services/top-services-list';
import { cn } from '@/lib/utils';
import { Montserrat } from 'next/font/google';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BuildIcon from '@mui/icons-material/Build';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InfoCard from '@/components/dashboard/info-card';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';

const font = Montserrat({
    subsets: ['latin'],
    weight: ["600"]
});

const HomePage: React.FC = () => {
    const role = useCurrentRole();
    const user = useCurrentUser();
    return (
        <div className={cn('flex flex-col items-center', font.className)}>
            <p className='p-5'>
                Bem vindo, {user?.name}
            </p>
            <div className='flex flex-col items-center gap-10'>
                <div className='bg-realce-seccondary-background p-4 rounded-lg w-full shadow-md'>
                    <Link href="/services" passHref>
                        <div className='flex items-center justify-between bg-slate-800 p-2 rounded-lg'>
                            <span className='flex items-center gap-2 text-white'>
                                <BuildIcon fontSize='medium' />
                                <h1 className=' text-white font-bold rounded-lg text-center'>Meus Serviços</h1>
                            </span>
                            <span className='rounded-full flex p-1 text-lg text-white'>
                                <ChevronRightIcon fontSize='medium' />
                            </span>
                        </div>
                    </Link>
                    <div className='flex items-center justify-between pb-4 pt-4'>
                        <h1>Prazos Próximos</h1>
                    </div>
                    <TopServicesList />
                </div>
                {role === "ADMIN" && (
                    <div className='bg-realce-seccondary-background p-4 rounded-lg w-full shadow-md'>
                        <Link href="/dashboard" passHref>
                            <div className='flex items-center justify-between bg-slate-800 p-2 rounded-lg'>
                                <span className='flex gap-2 text-white'>
                                    <AssessmentIcon fontSize='medium' />
                                    <h1 className='font-bold rounded-lg text-center'>Relatórios</h1>
                                </span>
                                <span className='text-white rounded-full flex p-1 text-lg'>
                                    <ChevronRightIcon fontSize='medium' />
                                </span>
                            </div>
                        </Link>
                        <div className='flex flex-col justify-between pb-4 pt-4'>
                            <h1>Dados de Faturamento</h1>
                            <InfoCard />
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
};

export default HomePage;
