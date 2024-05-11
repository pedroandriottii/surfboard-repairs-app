import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

        if (deadline < now) {
            return 'text-red-500';
        }

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
                <Button onClick={() => setStatusFilter('PENDING')} className={statusFilter === 'PENDING' ? "secondary" : "ghost"}>Pendentes</Button>
                <Button onClick={() => setStatusFilter('READY')} className={statusFilter === 'READY' ? "secondary" : "ghost"}>Prontos</Button>
                <Button onClick={() => setStatusFilter('DELIVERED')} className={statusFilter === 'DELIVERED' ? "secondary" : "ghost"}>Entregues</Button>
            </div>
            {role === "ADMIN" && (
                <div className="flex mt-4 items-center align-center justify-between bg-slate-800 p-2 m-4 rounded-xl text-white">
                    <h1 className={cn('font-bold', font.className)}>{statusTexts[statusFilter]}</h1>
                    <Link href="/create-service" passHref >
                        <button className="bg-[#15803D] text-white p-1 rounded-lg font-bold">
                            Novo Conserto
                        </button>
                    </Link>
                </div>

            )}
            <div className={cn("flex flex-col justify-center p-2 bg-realce-seccondary-background rounded-lg mr-5 ml-5", font.className)}>
                {filteredServices?.map((service, index) => (
                    <div key={service.id} className={`flex items-center border-b-2 ${index === filteredServices.length - 1 ? 'border-none' : ''}`}>
                        <div className="relative w-32 h-20 flex-shrink-0">
                            <img src={service.photo_url ?? '@/public/placeholder.png'} alt="Foto do Serviço" className="absolute h-full w-full object-cover rounded-l-lg" />
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
            </div>
        </div >
    );
};

export default ServicesList;
