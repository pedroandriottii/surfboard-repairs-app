import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useCurrentRole } from "@/hooks/use-current-role";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getAllServices, getServicesByEmail } from '@/data/services';
import { Service, ServiceStatus } from '@prisma/client';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const statusTexts = {
    PENDING: "Serviços Pendentes",
    READY: "Serviços Prontos",
    DELIVERED: "Serviços Entregues"
}

const ExibitionMode = {
    LIST: "LIST",
    GRID: "GRID"
} as const;

type ExibitionMode = typeof ExibitionMode[keyof typeof ExibitionMode];

interface ServicesListProps {
    initialStatus: ServiceStatus;
    exibitionMode: ExibitionMode;
}

const ServicesList: React.FC<ServicesListProps> = ({ initialStatus, exibitionMode }) => {
    const role = useCurrentRole();
    const user = useCurrentUser();
    const [services, setServices] = useState<Service[] | null>(null);
    const [statusFilter, setStatusFilter] = useState<ServiceStatus>(initialStatus);

    useEffect(() => {
        const fetchServices = async () => {
            if (role === "ADMIN") {
                const services = await getAllServices();
                setServices(services);
            } else if (role === "USER") {
                const services = await getServicesByEmail(user?.email ?? '');
                setServices(services);
            }
        };

        fetchServices();
    }, [role, user?.email]);

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const monthIndex = d.getMonth();
        const month = months[monthIndex];
        return `${day}/${month}/${d.getFullYear()}`;
    }

    const filteredServices = services?.filter(service => service.status === statusFilter);

    return (
        <div>
            {role === "ADMIN" && (
                <div className="flex mt-4 items-center align-center justify-between bg-slate-800 p-2 m-4 rounded-xl text-white">
                    <h1 className='font-bold'>{statusTexts[statusFilter]}</h1>
                    <Link href="/create-service" passHref >
                        <button className="bg-[#15803D] text-white p-1 rounded-lg font-bold">
                            Novo Conserto
                        </button>
                    </Link>
                </div>
            )}
            <div>
                <Carousel>
                    <CarouselContent>
                        {filteredServices?.map((service, index) => (
                            <CarouselItem key={service.id} className="basis-1/2 p-2 flex flex-col items-center">
                                <Link href={`/services/${service.id}`} className="w-full">
                                    <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
                                        <Image
                                            src={service.photo_url ?? '/placeholder.png'}
                                            alt="Foto do Serviço"
                                            layout="fill"
                                            className="rounded-t-lg object-cover"
                                        />
                                    </div>
                                    <div className="w-full flex justify-between items-center bg-realce text-black p-1 pl-4">
                                        <p>{formatDate(service.max_time)}</p>
                                        <ChevronRightIcon style={{ width: '24px', height: '24px' }} />
                                    </div>
                                    <div className='bg-white text-black font-bold p-1 pl-4 rounded-b-lg'>
                                        <p className='truncate'>{service.client_name}</p>
                                    </div>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div >
    );
};

export default ServicesList;
