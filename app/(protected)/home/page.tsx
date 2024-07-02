"use client";
import React from 'react';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/auth/user-button';
import TopServicesList from '@/components/services/top-services-list';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ServicesList from '@/components/services/services-list';

const HomePage: React.FC = () => {
    const role = useCurrentRole();
    const user = useCurrentUser();
    return (
        <div className="min-h-screen flex flex-col justify-between">
            <div className="relative w-full h-full flex-grow">
                <div className="absolute inset-0">
                    <Image
                        src={'/splash.png'}
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
                        <div className='flex gap-6 items-center'>
                            <Button className='bg-realce text-black hover:bg-white max-h-8 px-10 rounded-xl'>
                                Serviços
                            </Button>
                            {role == 'ADMIN' && (
                                <Button>
                                    Finanças
                                </Button>
                            )}
                            <UserButton />
                        </div>
                    </div>
                    <div className='text-white flex flex-col w-full p-6 gap-2'>
                        <h2 className='font-bold text-xl'>Bem Vindo, {user?.name}</h2>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center'>
                                <p>Prazos Próximos</p>
                                <ChevronRightIcon />
                            </div>
                            <div>
                                <TopServicesList />
                            </div>
                        </div>
                        <div className='flex items-center w-full'>
                            <p>Prontos</p>
                            <ChevronRightIcon />
                            <hr className='flex-grow border-t-2 border-white ml-2' />
                        </div>
                        <div>
                            <ServicesList initialStatus='READY' exibitionMode='LIST' />
                        </div>
                        <div className='flex items-center w-full'>
                            <p>Pendentes</p>
                            <ChevronRightIcon />
                            <hr className='flex-grow border-t-2 border-white ml-2' />
                        </div>
                        <div>
                            <ServicesList initialStatus='PENDING' exibitionMode='LIST' />
                        </div>
                        <div className='flex items-center w-full'>
                            <p>Entregues</p>
                            <ChevronRightIcon />
                            <hr className='flex-grow border-t-2 border-white ml-2' />
                        </div>
                        <div>
                            <ServicesList initialStatus='DELIVERED' exibitionMode='LIST' />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-black w-full flex flex-col items-center gap-4 p-4 lg:bg-transparent">
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

export default HomePage;
