import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/base/navbar";
import { Montserrat } from "next/font/google";
import Link from 'next/link';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useCurrentRole } from "@/hooks/use-current-role";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getAllServices, getServicesByEmail } from '@/data/services';
import { Service, ServiceStatus } from '@prisma/client';
import React, { useEffect, useState } from 'react';

const font = Montserrat({
    subsets: ['latin'],
    weight: ["600"]
});

const statusTexts = {
    PENDING: "Serviços Pendentes",
    READY: "Serviços Prontos",
    DELIVERED: "Serviços Entregues"
}

const ServicesList = () => {
    const role = useCurrentRole();
    const user = useCurrentUser();
    const [services, setServices] = useState<Service[] | null>(null);
    const [statusFilter, setStatusFilter] = useState<ServiceStatus>("PENDING");

    useEffect(() => {
        if (role === "ADMIN") {
            const fetchServices = async () => {
                const services = await getAllServices();
                setServices(services);
            };
            fetchServices();
        } else if (role === "USER") {
            const fetchServices = async () => {
                const services = await getServicesByEmail(user?.email ?? '');
                setServices(services);
            };
            fetchServices();
        }
    }, [role, user?.email]);

    function formatDate(date: Date) {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const monthIndex = d.getMonth();
        const month = months[monthIndex];
        return `${day}/${month}`;
    }

    const filteredServices = services?.filter(service => service.status === statusFilter);

    function getMaxtimeClass(maxTime: Date): string {
        const now = new Date();
        const deadline = new Date(maxTime);
        const diffTime = Math.abs(deadline.getTime() - now.getTime());
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
            <div className="flex items-center justify-center gap-4 p-2">
                <Button onClick={() => setStatusFilter('PENDING')} className={statusFilter === 'PENDING' ? 'active' : ''}>Pendentes</Button>
                <Button onClick={() => setStatusFilter('READY')} className={statusFilter === 'READY' ? 'active' : ''}>Prontos</Button>
                <Button onClick={() => setStatusFilter('DELIVERED')} className={statusFilter === 'DELIVERED' ? 'active' : ''}>Entregues</Button>
            </div>
            <h1 className={cn('font-bold ml-5 mb-1 mt-4', font.className)}>{statusTexts[statusFilter]}</h1>
            <div className={cn("flex flex-col justify-center p-2 bg-[#F9FAFB] rounded-lg mr-5 ml-5", font.className)}>
                {filteredServices?.map((service, index) => (
                    <div key={service.id} className={`flex items-center border-b-2 ${index === filteredServices.length - 1 ? 'border-none' : ''}`}>
                        <div className="relative w-32 h-20 flex-shrink-0">
                            <img src={service.photo_url ?? '/placeholder.png'} alt="Foto do Serviço" className="absolute h-full w-full object-cover rounded-l-lg" />
                        </div>
                        <div className='flex flex-1 justify-between items-center pl-4'>
                            <div>
                                <p className='truncate'>{service.client_name}</p>
                                <p className={`${getMaxtimeClass(service.max_time)}`}>{formatDate(service.max_time)}</p>
                            </div>
                            <Link href={`/services/${service.id}`} passHref className=" text-white bg-[#1E293B] rounded-full mr-2">
                                <ChevronRightIcon style={{ width: '26px', height: '26px' }} />
                            </Link>
                        </div>
                    </div>
                ))}
                {role === "ADMIN" && (
                    <Link href="/create-service" passHref>
                        <Button variant="default" className="mt-4 w-full">
                            Registrar Conserto
                        </Button>
                    </Link>
                )}
            </div>
        </div >
    );
};

export default ServicesList;
