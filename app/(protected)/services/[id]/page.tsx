'use client';
import { getServiceById } from '@/data/services';
import { Service, UserRole } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Link from 'next/link';
import { useCurrentRole } from '@/hooks/use-current-role';
import { toast } from 'react-toastify';
import { ChangeStatusSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';
import { updateStatus } from '@/actions/update-status';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ClassNames } from '@emotion/react';

const ServiceId = () => {
    const [service, setService] = useState<Service | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
    const router = useRouter();
    const pathName = usePathname();
    const role = useCurrentRole();

    const form = useForm<z.infer<typeof ChangeStatusSchema>>({
        resolver: zodResolver(ChangeStatusSchema),
    })

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

    useEffect(() => {
        if (typeof id === 'string') {
            const fetchService = async () => {
                const fetchedService = await getServiceById(id);
                setService(fetchedService);
            }
            fetchService();
        }

    }, [id])

    const generateWhatsAppLink = (phone?: string, status?: string) => {
        const baseMessage = 'Olá! Sua prancha ';
        const statusMessage = status === 'DELIVERED' ? 'foi entregue!' : 'está pronta para ser retirada!';
        return `https://api.whatsapp.com/send?phone=55${phone}&text=${baseMessage}${statusMessage}`;
    };

    const onSubmit = async (values: z.infer<typeof ChangeStatusSchema>) => {
        const formValues = { ...values };
        updateStatus(id, formValues).then(result => {
            if (result.success) {
                toast.success("Status Atualizado com sucesso");
                const link = generateWhatsAppLink(service?.phone, values.status);
                setWhatsappLink(link);
            } else {
                toast.error('Erro ao mudar o Status: ' + error);
            }
        }).catch(error => {
            setError("Erro ao mudar o Status: " + error);
            toast.error('Erro ao mudar o Status');
        })

    };



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
                        {(service.status === 'READY' || service.status === 'PENDING') && role === "ADMIN" && (
                            <>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col p-2 gap-2'>
                                        <FormField control={form.control} name="status" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <FormControl>
                                                        <div className='flex flex-col items-center text-center'>
                                                            <label className='p-1'>Atualizar Status</label>
                                                            <select {...field} name="status" className='input-class-name flex flex-col border-input px-3 py-2 border-slate-800 border-2 rounded-lg bg-slate-200 w-full'>
                                                                <option value="READY">Pronto</option>
                                                                <option value="DELIVERED">Entregue</option>
                                                            </select>
                                                        </div>
                                                    </FormControl>
                                                </FormLabel>
                                            </FormItem>
                                        )} />
                                        <Button type="submit">
                                            Confirmar
                                        </Button>
                                    </form>
                                </Form>
                                <div className='flex items-center align-center justify-center'>
                                    {service ? (
                                        <div>
                                            {whatsappLink && (
                                                <button className="bg-[#16A34A] p-2 rounded-lg shadow-md text-white" onClick={() => window.open(whatsappLink, '_blank')} >
                                                    Enviar WhatsApp
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <p>Carregando detalhes do serviço...</p>
                                    )}
                                </div>
                            </>
                        )}
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
function updateServiceStatusById(id: string, arg1: { status: string; }) {
    throw new Error('Function not implemented.');
}

