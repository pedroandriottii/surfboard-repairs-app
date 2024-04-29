'use client';
import { getServiceById } from '@/data/services';
import { Service } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ServiceId = () => {
    const [service, setService] = useState<Service | null>(null);

    const pathName = usePathname();

    const id = pathName.replace('/services/', '');


    useEffect(() => {
        if (typeof id === 'string') {
            const fetchService = async () => {
                const fetchedService = await getServiceById(id);
                setService(fetchedService);
            }
            fetchService();
        }

    }, [id])

    return (
        <div>
            <h1>{id}</h1>
            {service ? (
                <div>
                    <h1>Detalhes do Serviço</h1>
                    <p>Nome do Cliente: {service.client_name}</p>
                    <p>Email: {service.user_mail}</p>
                    <p>Telefone: {service.phone}</p>
                    <p>Valor: {service.value}</p>
                    <p>Data Máxima: {new Date(service.max_time).toLocaleDateString()}</p>
                    <p>Descrição: {service.description}</p>
                    <p>Método de Pagamento: {service.payment_method}</p>
                    <p>Status: {service.status}</p>
                </div>
            ) : (
                <p>Carregando detalhes do serviço...</p>
            )}
        </div>
    );
};

export default ServiceId;
