import React, { useEffect, useState } from 'react';
import { Service } from '@prisma/client';
import { getAllServices } from '@/data/services';
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCurrentRole } from '@/hooks/use-current-role';
import Link from 'next/link';
import { ChevronRightIcon } from '@radix-ui/react-icons';

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
                    service.status === "PENDING" || service.status === "READY"
                );

                if (role === 'USER') {
                    filteredServices = filteredServices.filter(service =>
                        service.user_mail === user.email
                    );
                }

                filteredServices.sort((a, b) => new Date(a.max_time).getTime() - new Date(b.max_time).getTime()).slice(0, 4);
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
            {services.map((service) => (
                <div key={service.id} className={`flex items-center justify-between p-2 border-b ${services.indexOf(service) === services.length - 1 ? 'border-none' : 'border-gray-300'}`}>
                    <div className='flex-grow'>
                        <p className='truncate'>{service.client_name}</p>
                        <p className={`${getMaxtimeClass(new Date(service.max_time))}`}>{formatDate(new Date(service.max_time))}</p>
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
