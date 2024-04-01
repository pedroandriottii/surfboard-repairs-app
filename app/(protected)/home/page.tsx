"use client";
import React, { useEffect, useState } from 'react';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAllServices, getServicesByEmail } from '@/data/services';
import { Service } from '@prisma/client';

import { ChevronRightIcon } from '@radix-ui/react-icons';

import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Montserrat({
    subsets: ['latin'],
    weight: ["600"]
});

const HomePage = () => {
    const role = useCurrentRole();
    const user = useCurrentUser();
    const [services, setServices] = useState<Service[] | null>();

    useEffect(() => {
        if (role === "ADMIN") {
            const getServices = async () => {
                const services = await getAllServices()
                setServices(services);
            }
            getServices();

        }
        if (role === "USER") {
            const getServices = async () => {
                const services = await getServicesByEmail(user?.email!!)
                setServices(services);
            }
            getServices();
        }
    }, [user?.email, role])

    function formatDate(date: any) {
        const day = date.getDate().toString().padStart(2, '0');
        const months = [
            'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
            'jul', 'ago', 'set', 'out', 'nov', 'dez'
        ];
        const monthIndex = date.getMonth();
        const month = months[monthIndex];
        return `${day}/${month}`;
    }

    if (role === "ADMIN") {
        return (
            <div>
                <h1 className={cn('font-bold ml-5 mb-1 mt-4', font.className)}>Consertos em Andamento</h1>
                <div className={cn("flex flex-col align-center justify-center p-2 bg-[#F9FAFB] rounded-lg mr-5 ml-5 font-[700]", font.className)}>
                    {services?.map((service) => {
                        return (
                            <div key={service.id} className='flex items-center border-b-2 last:border-none'>
                                <div className="relative w-32 h-20 flex-shrink-0">
                                    <img src={service.photo_url ?? '/placeholder.png'} alt="Foto do Serviço" className="absolute h-full w-full object-cover rounded-l-lg" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F9FAFB]"></div>
                                </div>
                                <div className='flex flex-1 justify-between items-center pl-4'>
                                    <div>
                                        <p className='truncate'>{service.client_name}</p>
                                        <p className='text-[#6B7589]'>{formatDate(service.max_time)}</p>
                                    </div>
                                    <ChevronRightIcon style={{ width: '22px', height: '22px' }} />
                                </div>
                            </div>
                        )
                    })}
                    <Button variant="default" className=" mt-4">
                        <Link href="/create-service">Registrar Conserto</Link>
                    </Button>
                </div>
            </div>

        )
    }
    if (role === "USER") {
        return (
            <div>
                <h1 className={cn('ml-5 mb-1 font-[500]', font.className)}>
                    Seus Serviços
                </h1>
                <div className={cn("flex flex-col align-center justify-center p-2 bg-[#F9FAFB] rounded-lg mr-5 ml-5 font-[700]", font.className)}>
                    {services?.map((service) => {
                        return (
                            <div key={service.id} className='flex items-center border-b-2 last:border-none'>
                                <div className="relative w-32 h-20 flex-shrink-0">
                                    <img src={service.photo_url ?? '/placeholder.png'} alt="Foto do Serviço" className="absolute h-full w-full object-cover rounded-l-lg" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F9FAFB]"></div>
                                </div>
                                <div className='flex flex-1 justify-between items-center pl-4'>
                                    <div>
                                        <p className='truncate'>{service.client_name}</p>
                                        <p className='text-[#6B7589]'>{formatDate(service.max_time)}</p>
                                    </div>
                                    <ChevronRightIcon style={{ width: '22px', height: '22px' }} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default HomePage;