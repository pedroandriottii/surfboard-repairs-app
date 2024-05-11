'use client';
import { getServiceById } from '@/data/services';
import { Service } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Link from 'next/link';

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
                            <p>{`R$ ${service.value}`}</p>
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
                            <p>{service.payment_method}</p>
                        </div>
                        <div className="bg-slate-200 p-1 border border-slate-400 rounded-xl m-2 flex flex-col text-center">
                            <p className='text-slate-500 text-sm'>Status</p>
                            <p>{service.status}</p>
                        </div>
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
