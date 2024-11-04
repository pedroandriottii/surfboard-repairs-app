import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { Service, ServiceStatus } from '@prisma/client';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useUser } from '@/context/UserContext';
import Cookies from 'js-cookie';
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from 'lucide-react';

const ExibitionMode = {
    LIST: "LIST",
    GRID: "GRID"
} as const;

type ExibitionMode = typeof ExibitionMode[keyof typeof ExibitionMode];

interface ServicesListProps {
    initialStatus: ServiceStatus;
    exibitionMode: ExibitionMode;
    onEmpty?: () => void;
}

const ServicesList: React.FC<ServicesListProps> = ({ initialStatus, exibitionMode, onEmpty }) => {
    const { user } = useUser();
    const [services, setServices] = useState<Service[] | null>(null);
    const [statusFilter] = useState<ServiceStatus>(initialStatus);
    const [isLoading, setIsLoading] = useState(true);

    const getServicesByStatus = async (status: ServiceStatus) => {
        try {
            const token = Cookies.get('accessToken');
            if (!token) {
                throw new Error('Token JWT não encontrado nos cookies.');
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services?status=${status}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro na API:', errorData);
                throw new Error(errorData.message || 'Erro ao buscar os serviços.');
            }

            const data: Service[] = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar os serviços:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true);
            if (user?.role) {
                try {
                    const services = await getServicesByStatus(statusFilter);
                    setServices(services);

                    if (services?.length === 0 && onEmpty) {
                        onEmpty();
                    }
                } catch (error) {
                    console.error('Erro ao buscar os serviços:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchServices();
    }, [user?.role, statusFilter, onEmpty]);

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const monthIndex = d.getMonth();
        const month = months[monthIndex];
        return `${day}/${month}/${d.getFullYear()}`;
    };

    const renderSkeleton = () => (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem key={i} className="basis-1/2 flex flex-col items-center md:basis-1/6">
                    <Skeleton className="relative w-full h-40 bg-gray-200 rounded-lg" />
                    <div className="w-full bg-gray-100 h-6 mt-2 rounded-md"></div>
                    <div className="w-full bg-gray-100 h-6 mt-1 rounded-md"></div>
                </CarouselItem>
            ))}
        </>
    );

    return (
        <div>
            {isLoading ? (
                exibitionMode === ExibitionMode.LIST ? (
                    <Carousel>
                        <CarouselContent>{renderSkeleton()}</CarouselContent>
                    </Carousel>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <Skeleton className="relative w-full h-40 bg-gray-200 rounded-lg" />
                                <div className="w-full bg-gray-100 h-6 mt-2 rounded-md"></div>
                                <div className="w-full bg-gray-100 h-6 mt-1 rounded-md"></div>
                            </div>
                        ))}
                    </div>
                )
            ) : services?.length === 0 ? (
                <div className=' flex items-center gap-4'>
                    <Info className='text-realce' />
                    <p>Você não tem pranchas nessa fase</p>
                </div>
            ) : exibitionMode === ExibitionMode.LIST ? (
                <Carousel>
                    <CarouselContent>
                        {services?.map((service) => (
                            <CarouselItem key={service.id} className="basis-1/2 flex flex-col items-center md:basis-1/6">
                                <Link href={`/services/${service.id}`} className="w-full">
                                    <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
                                        <Image
                                            fill
                                            src={service.photo_url ?? '/placeholder.jpg'}
                                            alt="Foto da Prancha"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-2">
                    {services?.map((service) => (
                        <div key={service.id} className="flex flex-col items-center">
                            <Link href={`/services/${service.id}`} className="w-full">
                                <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
                                    <Image
                                        src={service.photo_url ?? '/placeholder.jpg'}
                                        alt="Foto da Prancha"
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServicesList;