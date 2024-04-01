"use client";
import React, { useEffect, useState } from 'react';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAllServices, getServicesByEmail } from '@/data/services';
import { Service } from '@prisma/client';


import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { ChevronRightIcon } from '@radix-ui/react-icons';

import { FaUser } from 'react-icons/fa';
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
                <div className={cn("flex flex-col align-center justify-center p-2 bg-[#F9FAFB] rounded-lg mr-5 ml-5 font-[700]", font.className)}>
                    {services?.map((service) => {
                        return (
                            <div className='flex align-center items-center border-b-2 last:border-none'>
                                <div className='justify-center align-center flex flex-col p-2'>
                                    <Avatar>
                                        <AvatarImage src={user?.image || ""} />
                                        <AvatarFallback className="bg-sky-500">
                                            <FaUser className="text-white" />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className='flex  w-full justify-between items-center'>
                                    <div key={service.id} className='flex justify-between'>
                                        <div className='text-left align-left justify-start pl-4'>
                                            <p>{service.client_name}</p>
                                            <p className='text-[#6B7589]'>{formatDate(service.max_time)}</p>
                                        </div>
                                    </div>
                                    <ChevronRightIcon style={{ width: '22px', height: '22px' }} />
                                </div>
                            </div>
                        )
                    })
                    }
                    <Button variant="default">
                        <Link href="/create-service">Registar Conserto</Link>
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
                            <div className='flex align-center items-center border-b-2 last:border-none'>
                                <div className='justify-center align-center flex flex-col p-2'>
                                    <Avatar>
                                        <AvatarImage src={user?.image || ""} />
                                        <AvatarFallback className="bg-sky-500">
                                            <FaUser className="text-white" />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className='flex  w-full justify-between items-center'>
                                    <div key={service.id} className='flex justify-between'>
                                        <div className='text-left align-left justify-start pl-4'>
                                            <p>{service.client_name}</p>
                                            <p className='text-[#6B7589]'>{formatDate(service.max_time)}</p>
                                        </div>
                                    </div>
                                    <ChevronRightIcon style={{ width: '22px', height: '22px' }} />
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        )
    }
}

export default HomePage;