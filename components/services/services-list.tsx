"use client";
import React, { useEffect, useState } from 'react';

import { ChevronRightIcon } from '@radix-ui/react-icons';

import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Service } from '@prisma/client';
import { getAllServices, getServicesByEmail } from '@/data/services';
import { Button } from '../ui/button';
import Link from 'next/link';

const font = Montserrat({
    subsets: ['latin'],
    weight: ["600"]
});

type ServiceStatus = "PENDING" | "READY" | "DELIVERED";

const statusTexts = {
    PENDING: "Serviços Pendentes",
    READY: "Serviços Prontos",
    DELIVERED: "Serviços Entregues"

}

const ServicesList = () => {
    const role = useCurrentRole();
    const user = useCurrentUser();
    const [services, setServices] = useState<Service[] | null>();
    const [statusFilter, setStatusFilter] = useState<ServiceStatus>("PENDING");

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

    const filteredServices = services?.filter((service) => {
        return service.status === statusFilter;
    })

    function getMaxtimeClass(max_time: string | number): string {
        const now = new Date();
        const maxTime = new Date(max_time);
        const diffTime = Math.abs(maxTime.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 3) {
            return 'text-green-500';
        } else if (diffDays > 1) {
            return 'text-yellow-500';
        } else {
            return 'text-red-500';
        }

    }


    return (
        <div className='mb-24'>
            <div className="flex items-center align-center justify-center gap-4 p-2">
                <Button onClick={() => setStatusFilter('PENDING')} className={statusFilter === 'PENDING' ? 'active' : ''}>Pendentes</Button>
                <Button onClick={() => setStatusFilter('READY')} className={statusFilter === 'READY' ? 'active' : ''}>Prontos</Button>
                <Button onClick={() => setStatusFilter('DELIVERED')} className={statusFilter === 'DELIVERED' ? 'active' : ''}>Entregues</Button>
            </div>

            <h1 className={cn('font-bold ml-5 mb-1 mt-4', font.className)}>{statusTexts[statusFilter]}</h1>
            <div className={cn("flex flex-col align-center justify-center p-2 bg-[#F9FAFB] rounded-lg mr-5 ml-5", font.className)}>

                {filteredServices?.map((service, index) => {
                    const isLast = index === filteredServices.length - 1;
                    const maxtimeClass = service.status === "PENDING" ? getMaxtimeClass(service.max_time.toISOString()) : '';
                    return (
                        <div key={service.id} className={`flex items-center border-b-2 ${isLast ? 'border-none' : ''}`}>
                            <div className="relative w-32 h-20 flex-shrink-0">
                                <img src={service.photo_url ?? '/placeholder.png'} alt="Foto do Serviço" className="absolute h-full w-full object-cover rounded-l-lg" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F9FAFB]"></div>
                            </div>
                            <div className='flex flex-1 justify-between items-center pl-4'>
                                <div>
                                    <p className='truncate'>{service.client_name}</p>
                                    <p className={`${maxtimeClass}`}>{formatDate(service.max_time)}</p>
                                </div>
                                <ChevronRightIcon style={{ width: '22px', height: '22px' }} />
                            </div>
                        </div>

                    )
                })}
                {role === "ADMIN" && (
                    <Button variant="default" className=" mt-4">
                        <Link href="/create-service">Registrar Conserto</Link>
                    </Button>
                )}
            </div>
        </div >

    )
}
export default ServicesList;