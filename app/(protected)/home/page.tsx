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
import Link from 'next/link';

const HomePage: React.FC = () => {
    const role = useCurrentRole();
    const user = useCurrentUser();
    return (
        <div className="flex flex-col justify-between min-h-screen overflow-x-hidden">
            <div className="relative w-full flex-grow">
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
                        className="object-cover h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-black via-black/85"></div>
                </div>
                <div className="relative z-20 flex flex-col items-center w-full">
                    <div className='flex justify-between w-full md:pr-4 p-4'>
                        <Image
                            src={'/realce_logo.png'}
                            alt="Realce Nordeste"
                            width={50}
                            height={50}
                        />
                        <div className='flex gap-4 items-center'>
                            <Link href={'/home'}>
                                <Button className='bg-realce text-black hover:bg-white max-h-8 rounded-xl'>
                                    Serviços
                                </Button>
                            </Link>

                            {role == 'ADMIN' && (
                                <div className='flex items-center gap-4'>
                                    <Link href={'/dashboard'}>
                                        <Button className='bg-transparent border-2 border-realce text-white  hover:bg-white max-h-8 rounded-xl hover:text-black hover:border-none hover:transition-all' >
                                            Finanças
                                        </Button>
                                    </Link>
                                </div>
                            )}
                            <UserButton />
                        </div>
                    </div>
                    <div className='text-white flex flex-col w-full gap-4'>
                        <div className='flex flex-col gap-4 p-4'>
                            <h2 className='font-bold text-xl'>Bem Vindo, {user?.name}</h2>
                            <div className='flex items-center'>
                                <p>Prazos Próximos</p>
                                <ChevronRightIcon />
                            </div>
                            <div>
                                <TopServicesList />
                            </div>
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
                        <Link href='/home/pending'>
                            <div className='font-bold flex items-center bg-realce w-1/3 md:w-1/12 justify-between text-black py-1 rounded-r-full hover:w-1/3 hover:transition-all'>
                                <p className='ml-4'>Pendentes</p>
                                <ChevronRightIcon />
                            </div>
                        </Link>
                        <div className='p-4'>
                            <ServicesList initialStatus='PENDING' exibitionMode='LIST' />
                        </div>
                        <Link href='/home/delivered'>
                            <div className='font-bold flex items-center bg-realce w-1/3 md:w-1/12 justify-between text-black py-1 rounded-r-full hover:w-1/3 hover:transition-all'>
                                <p className='ml-4'>Entregues</p>
                                <ChevronRightIcon />
                            </div>
                        </Link>
                        <div className='p-4'>
                            <ServicesList initialStatus='DELIVERED' exibitionMode='LIST' />
                        </div>
                    </div>
                    <Link href={'/create-service'} className='flex w-full items-center justify-center p-6'>
                        <Button className='bg-realce text-black hover:bg-white max-h-8 rounded-xl font-bold'>Cadastrar Novo Conserto</Button>
                    </Link>
                </div>
            </div>
            <div className="bg-black w-full flex flex-col items-center gap-4 p-4">
                <p className="text-realce font-bold">Visite nossa loja!</p>
                <a href="https://maps.app.goo.gl/ZCcjUhyGsoxS9TUA6" target='__blank' className="underline text-white text-center">Av. Pres. Castelo Branco, 8159, Jaboatão dos Guararapes</a>
                <div className="flex items-center gap-4">
                    <a href="https://api.whatsapp.com/send?phone=5581988145906" target='__blank'>
                        <Image
                            src={'/whats_footer.svg'}
                            alt="Whatsapp Realce Nordeste"
                            width={30}
                            height={30}
                        />
                    </a>
                    <a href="https://www.instagram.com/realce.nordeste/" target='__blank'>
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
