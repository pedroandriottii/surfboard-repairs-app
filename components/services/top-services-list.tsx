import React, { useEffect, useState } from 'react';
import { Service } from '@prisma/client';
import { getAllServices } from '@/data/services';
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCurrentRole } from '@/hooks/use-current-role';
import Link from 'next/link';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

interface User {
    email: string;
}

type Role = 'ADMIN' | 'USER';

const TopServicesList: React.FC = () => {
    const role = useCurrentRole() as Role;
    const user = useCurrentUser() as User;
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        const fetchServices = async () => {
            const allServices = await getAllServices();
            if (allServices) {
                let filteredServices = allServices.filter(service =>
                    (service.status === "PENDING" || service.status === "READY") && new Date(service.max_time) > new Date()
                );

                if (role === 'USER') {
                    filteredServices = filteredServices.filter(service =>
                        service.user_mail === user.email
                    );
                }

                filteredServices = filteredServices.sort((a, b) => new Date(a.max_time).getTime() - new Date(b.max_time).getTime()).slice(0, 4);
                setServices(filteredServices);
            }
        };

        fetchServices();
    }, [user?.email, role]);

    function formatDate(date: Date) {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const monthIndex = d.getMonth();
        const month = months[monthIndex];
        return `${day}/${month}`;
    }

    return (
        <Carousel className='w-full'>
            <CarouselContent>
                {services.map((service) => (
                    <CarouselItem key={service.id} className='flex w-full h-full basis-1/3 mx-2 md:basis-1/6 lg:basis-1/12'>
                        < Link href={`/services/${service.id}`
                        } passHref>
                            <div className='bg-white rounded-xl'>
                                <p className='bg-realce px-10 text-left text-black rounded-t-xl'>{formatDate(new Date(service.max_time))}</p>
                                <p className='text-black font-bold p-2'>{service.client_name}</p>
                            </div>
                        </Link >
                    </CarouselItem >
                ))}
            </CarouselContent>
        </Carousel >
    );
};

export default TopServicesList;
