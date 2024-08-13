"use client";
import React from 'react';
import ServicesList from '@/components/services/services-list';
import { useCurrentRole } from '@/hooks/use-current-role';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/auth/user-button';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Navbar from '@/components/base/navbar';

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

export default GridPage;
