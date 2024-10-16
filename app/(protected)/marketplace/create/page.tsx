'use client';
import Navbar from '@/components/base/navbar';
import React from 'react';
import BackgroundImage from '@/components/base/backgroundImage';
import SurfboardForm from '@/components/surfboards/create-surfboards-form';
import { useUser } from '@/context/UserContext';

const Page: React.FC = () => {
    const { user } = useUser();

    return (
        <div className='relative w-full flex flex-col min-h-screen'>
            <BackgroundImage src="/splash.webp" alt="Background" />
            <BackgroundImage src="/splash_desk.webp" alt="Background" isDesktop />
            <div className="relative z-20 flex flex-col items-center w-full">
                <Navbar />
                <div className='p-4 flex flex-col gap-4'>
                    <h1 className='items-center flex w-full justify-center p-2 bg-realce rounded-md'>Área de Cadastro</h1>
                    {user?.role === 'ADMIN' || user?.role === 'MASTER' ? (
                        <SurfboardForm />
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Page;