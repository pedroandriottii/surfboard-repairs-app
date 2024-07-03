"use client";
import React from 'react';
import ServicesList from '@/components/services/services-list';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/auth/user-button';
import Link from 'next/link';

const GridPage: React.FC = () => {
    const role = useCurrentRole();
    return (
        <div className="min-h-screen flex flex-col justify-between overflow-x-hidden">
            <div className="relative w-full h-full flex-grow">
                <div className="absolute inset-0 md:hidden">
                    <Image
                        src={'/splash.png'}
                        alt="Background"
                        layout="fill"
                        className="object-cover h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-black via-black/85"></div>
                </div>
                <div className="hidden md:block absolute inset-0">
                    <Image
                        src={'/splash_desk.png'}
                        alt="Background"
                        layout="fill"
                        className="object-cover h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-black via-black/85"></div>
                </div>
                <div className="relative z-20 flex flex-col items-center">
                    <div className='flex justify-between w-full p-4'>
                        <Image
                            src={'/realce_logo.png'}
                            alt="Realce Nordeste"
                            width={50}
                            height={50}
                        />
                        <div className='flex gap-4 items-center'>
                            <Link href={'/home'}>
                                <Button className='bg-realce text-black hover:bg-white max-h-8 px-6 rounded-xl'>
                                    Serviços
                                </Button>
                            </Link>

                            {role == 'ADMIN' && (
                                <Link href={'/dashboard'}>
                                    <Button className='bg-realce text-black hover:bg-white max-h-8 px-6 rounded-xl' >
                                        Finanças
                                    </Button>
                                </Link>

                            )}
                            <UserButton />
                        </div>
                    </div>
                    <div className='text-white flex flex-col w-full gap-4 h-full'>
                        <div className='flex items-center w-full'>
                            <p className='bg-realce px-6 text-black font-bold rounded-r-full text-xl'>Entregues</p>
                        </div>
                        <ServicesList initialStatus='DELIVERED' exibitionMode='GRID' />
                        <div className='p-4'>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-black w-full flex flex-col items-center gap-4 p-4">
                <p className="text-realce font-bold">Visite nossa loja!</p>
                <p className="underline text-white text-center">Av. Pres. Castelo Branco, 8159, Jaboatão dos Guararapes</p>
                <div className="flex items-center gap-4">
                    <a href="">
                        <Image
                            src={'/whats_footer.svg'}
                            alt="Whatsapp Realce Nordeste"
                            width={30}
                            height={30}
                        />
                    </a>
                    <a href="">
                        <Image
                            src={'/insta_footer.svg'}
                            alt="Instagram Realce Nordeste"
                            width={30}
                            height={30}
                        />
                    </a>
                </div>
            </div>
        </div>
    )
};

export default GridPage;
