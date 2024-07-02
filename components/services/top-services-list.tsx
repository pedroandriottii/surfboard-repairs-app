import React, { useEffect, useState } from 'react';
import { Service } from '@prisma/client';
import { getAllServices } from '@/data/services';
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCurrentRole } from '@/hooks/use-current-role';
import Link from 'next/link';

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
        <div>
            {services.map((service) => (
                <div key={service.id} className='grid grid-cols-2'>
                    <Link href={`/services/${service.id}`} passHref>
                        <div className='bg-white rounded-xl w-full'>
                            <p className='bg-realce px-10 w-full text-left text-black rounded-t-xl'>{formatDate(new Date(service.max_time))}</p>
                            <p className='text-black font-bold p-2 w-[40vw]'>{service.client_name}</p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default TopServicesList;
