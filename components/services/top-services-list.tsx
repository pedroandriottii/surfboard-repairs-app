"use client";
import React, { useEffect, useState } from 'react';
import { Service } from '@prisma/client';
import { getAllServices } from '@/data/services';
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from 'next/link';
import { ChevronRightIcon } from '@radix-ui/react-icons';

const TopServicesList: React.FC = () => {
    const user = useCurrentUser();
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        const fetchServices = async () => {
            const allServices = await getAllServices();
            if (allServices) {
                const filteredServices = allServices.filter(service =>
                    service.status === "PENDING" || service.status === "READY")
                    .sort((a, b) => new Date(a.max_time).getTime() - new Date(b.max_time).getTime())
                    .slice(0, 4);
                setServices(filteredServices);
            }
        };
        fetchServices();
    }, [user?.email]);

    function formatDate(date: Date) {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const monthIndex = d.getMonth();
        const month = months[monthIndex];
        return `${day}/${month}`;
    }

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
        <div>
            {services.map((service, index) => (
                <div key={service.id} className={`flex items-center justify-between p-2 border-b ${index === services.length - 1 ? 'border-none' : 'border-gray-300'}`}>
                    <div className='flex-grow'>
                        <p className='truncate'>{service.client_name}</p>
                        <p className={`${getMaxtimeClass(service.max_time)}`}>{formatDate(service.max_time)}</p>
                    </div>
                    <Link href={`/services/${service.id}`} passHref>
                        <span className="flex items-center justify-center p-2">
                            <ChevronRightIcon width="24" height="24" />
                        </span>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default TopServicesList;
