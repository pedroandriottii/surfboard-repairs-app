'use client';
import { RoleGate } from '@/components/auth/role-gate';
import Navbar from '@/components/base/navbar';
import React from 'react';
import BackgroundImage from '@/components/base/backgroundImage';
import SurfboardForm from '@/components/surfboards/create-surfboards-form';

const Page: React.FC = () => {

    return (
        <div className='relative w-full flex flex-col min-h-screen'>
            <BackgroundImage src="/splash.webp" alt="Background" />
            <BackgroundImage src="/splash_desk.webp" alt="Background" isDesktop />
            <div className="relative z-20 flex flex-col items-center w-full">
                <Navbar />
                <div className='p-4 flex flex-col gap-4'>
                    <h1 className='items-center flex w-full justify-center p-2 bg-realce rounded-md'>Área de Cadastro</h1>
                    <RoleGate allowedRoles={['ADMIN', 'MASTER']}>
                        <SurfboardForm />
                    </RoleGate>
                </div>
            </div>
        </div>
    );
};

export default Page;