'use client';
import { getServiceById } from '@/data/services';
import { Service } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Link from 'next/link';
import { useCurrentRole } from '@/hooks/use-current-role';
import { toast } from 'react-toastify';

// enum ServiceStatus {
//     PENDING = "PENDING",
//     READY = "READY",
//     DELIVERED = "DELIVERED"
// }

const ServiceId = () => {
    const [service, setService] = useState<Service | null>(null);

    const pathName = usePathname();
    const role = useCurrentRole();

    const id = pathName.replace('/services/', '');

    const statusTranslate = {
        PENDING: 'Pendente',
        READY: 'Pronto',
        DELIVERED: 'Entregue',
    }

    const paymentMethodTranslate = {
        CREDIT_CARD: 'Cartão de Crédito',
        DEBIT_CARD: 'Cartão de Débito',
        CASH: 'Dinheiro',
        PIX: 'PIX',
        FREE: 'Grátis',
    }


    // const handleChangeStatus = async (serviceId: ServiceStatus, newStatus: ServiceStatus) => {
    //     try {
    //         const response = await fetch(`/api/services/${serviceId}/change-status`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ newStatus }),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Falha ao atualizar o status do serviço: ${response.statusText}`);
    //         }

    //         const result = await response.json();
    //         console.log("Status atualizado com sucesso!", result);
    //     } catch (error) {
    //         console.error("Erro ao atualizar o status do serviço", error);
    //     }
    // };



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
            {service ? (
                <div>
                    <img src={service.photo_url ?? '@/public/placeholder.png'} alt='Imagem da Prancha' className='max-h-60' />
                    <div className='flex-1 flex-col bg-white rounded-2xl items-center m-4 p-4 gap-2 shadow-md translate-y-[-3.5rem]'>
                        <div className='flex items-center bg-slate-800 text-white rounded-lg text-center p-3 m-2 align-center justify-around'>
                            <Link href='/services'>
                                <span className='text-white rounded-full'>
                                    <ChevronLeftIcon />
                                </span>
                            </Link>
                            <h1 className='text-center uppercase font-lg'>Detalhes do Serviço</h1>
                        </div>
                        <div className=" bg-slate-200 p-1 border border-slate-400 rounded-xl m-2 flex flex-col text-center">
                            <p className='text-slate-500 text-sm'>Nome do Cliente</p>
                            <p>{service.client_name}</p>
                        </div>
                        <div className="bg-slate-200 p-1 border border-slate-400 rounded-xl m-2 flex flex-col text-center">
                            <p className='text-slate-500 text-sm'>Email do Cliente</p>
                            <p>{service.user_mail}</p>
                        </div>
                        <div className="bg-slate-200 p-1 border border-slate-400 rounded-xl m-2 flex flex-col text-center">
                            <p className='text-slate-500 text-sm'>Telefone</p>
                            <p>{service.phone}</p>
                        </div>
                        <div className="bg-slate-200 p-1 border border-slate-400 rounded-xl m-2 flex flex-col text-center">
                            <p className='text-slate-500 text-sm'>Valor</p>
                            <p>{`R$ ${service.value} `}</p>
                        </div>
                        <div className="bg-slate-200 p-1 border border-slate-400 rounded-xl m-2 flex flex-col text-center">
                            <p className='text-slate-500 text-sm'>Prazo Máximo</p>
                            <p>{new Date(service.max_time).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-slate-200 p-1 border border-slate-400 rounded-xl m-2 flex flex-col text-center">
                            <p className='text-slate-500 text-sm'>Descrição</p>
                            <p>{service.description}</p>
                        </div>
                        <div className="bg-slate-200 p-1 border border-slate-400 rounded-xl m-2 flex flex-col text-center">
                            <p className='text-slate-500 text-sm'>Método de Pagamento</p>
                            <p>{paymentMethodTranslate[service.payment_method]}</p>
                        </div>
                        <div className="bg-slate-200 p-1 border border-slate-400 rounded-xl m-2 flex flex-col text-center">
                            <p className='text-slate-500 text-sm'>Status</p>
                            <p>{statusTranslate[service.status]}</p>
                        </div>
                        {/* {service.status === 'PENDING' && role === 'ADMIN' && (
                            <div className='bg-green' onClick={() => handleChangeStatus(ServiceStatus.READY)}>
                                <p>Mudar para Pronto</p>
                            </div>
                        )}
                        {service.status === 'READY' && role === 'ADMIN' && (
                            <div className='bg-green' onClick={() => handleChangeStatus(ServiceStatus.DELIVERED)}>
                                <p>Mudar para Entregue</p>
                            </div>
                        )} */}
                    </div>
                    <div>
                        Deletar Produto
                    </div>
                </div>
            ) : (
                <p>Carregando detalhes do serviço...</p>
            )
            }
        </div >
    );
};

export default ServiceId;
