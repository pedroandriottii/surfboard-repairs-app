'use client';
import { getServiceById } from '@/data/services';
import { Service } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Link from 'next/link';
import { useCurrentRole } from '@/hooks/use-current-role';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { updateStatus } from '@/actions/update-status';
import { deleteService } from '@/actions/delete-service';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import Timeline from '@/components/services/timeline';
import Navbar from '@/components/base/navbar';
import BackgroundImage from '@/components/base/backgroundImage';

const ServiceId = () => {
    const [service, setService] = useState<Service | null>(null);
    const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'PIX' | 'FREE' | undefined>(undefined);
    const pathName = usePathname();
    const role = useCurrentRole();
    const router = useRouter();
    const id = pathName.replace('/services/', '');

    const paymentMethodTranslate = {
        CREDIT_CARD: 'Cartão de Crédito',
        DEBIT_CARD: 'Cartão de Débito',
        CASH: 'Dinheiro',
        PIX: 'PIX',
        FREE: 'Grátis',
    };

    useEffect(() => {
        if (typeof id === 'string') {
            const fetchService = async () => {
                const fetchedService = await getServiceById(id);
                setService(fetchedService);
            };
            fetchService();
        }
    }, [id]);

    const generateWhatsAppLink = (phone?: string, status?: string) => {
        if (!phone) return null;

        const cleanedPhone = phone.replace(/\D/g, '');

        const baseMessage = 'Olá! Sua prancha ';
        const statusMessage = status === 'DELIVERED' ? 'foi entregue!' : 'está pronta para ser retirada!';
        return `https://api.whatsapp.com/send?phone=${cleanedPhone}&text=${baseMessage}${statusMessage}`;
    };

    const updateStatusHandler = async (newStatus: 'READY' | 'DELIVERED') => {
        const formValues: { status: 'READY' | 'DELIVERED'; ready_time?: Date; delivered_time?: Date; payment_method?: 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'PIX' | 'FREE' } = { status: newStatus };
        const currentDate = new Date();

        if (newStatus === 'READY') {
            formValues.ready_time = currentDate;
        } else if (newStatus === 'DELIVERED') {
            formValues.delivered_time = currentDate;
            formValues.payment_method = paymentMethod;
            if (!paymentMethod) {
                toast.error("Método de pagamento é obrigatório ao entregar");
                return;
            }
        }

        try {
            const result = await updateStatus(id, formValues);
            if (result.success) {
                toast.success("Status Atualizado com sucesso");
                const link = generateWhatsAppLink(service?.phone, newStatus);
                setWhatsappLink(link);
                setShowAlert(true);
            } else {
                toast.error('Erro ao mudar o Status: ' + result.error);
            }
        } catch (error) {
            toast.error('Erro ao mudar o Status');
        }
    };


    const handleDelete = async () => {
        try {
            const result = await deleteService(id);
            if (result.success) {
                toast.success("Serviço deletado com sucesso");
                router.push('/home');
            } else {
                toast.error('Erro ao deletar serviço: ' + result.error);
            }
        } catch (error) {
            toast.error('Erro ao deletar serviço');
        }
    };

    return (
        <div className="relative w-full flex flex-col min-h-screen overflow-x-hidden">
            <BackgroundImage src="/splash.png" alt="Background" />
            <BackgroundImage src="/splash_desk.png" alt="Background" isDesktop />
            <div className="relative z-20 flex flex-col items-center w-full">
                <div className='flex justify-between w-full md:pr-4'>
                    <Navbar role={role} />
                </div>
                <div className='w-full h-full flex flex-col gap-4'>
                    <Link href={'/home'} className='bg-realce rounded-r-full flex w-1/4 font-bold md:w-1/12'>
                        <ChevronLeftIcon />
                        <p className='text-black pl-4 justify-self-start'>Voltar</p>
                    </Link>
                    <div className='flex flex-col text-white w-full h-full items-center md:flex-row md:p-8'>
                        <div className="relative w-2/3 items-center md:w-1/2" style={{ aspectRatio: '1/1' }}>
                            <Image
                                src={service?.photo_url ?? '/placeholder.jpg'}
                                alt='Foto da Prancha'
                                layout='fill'
                                className="rounded-lg object-cover"
                            />
                        </div>
                        <div className='flex flex-col justify-self-start w-full p-4 gap-4'>
                            <h1 className='text-realce font-bold md:text-2xl text-center'>Detalhes do Serviço</h1>
                            <div className='md:flex-row w-full h-full flex flex-col gap-4'>
                                <div className='md:w-1/2'>
                                    <p className='text-realce'>Prancha</p>
                                    <p className='bg-input-color mr-4 py-1 rounded-md text-black pl-2'>{service?.client_name}</p>
                                </div>
                                <div className='md:w-1/2'>
                                    <p className='text-realce'>Valor</p>
                                    <p className='bg-input-color mr-4 py-1 rounded-md text-black pl-2'>R$ {service?.value}</p>
                                </div>
                            </div>
                            <div>
                                <p className='text-realce'>Descrição</p>
                                <p className='bg-input-color mr-4 py-1 rounded-md text-black pl-2'>{service?.description}</p>
                            </div>

                            {(role == 'ADMIN' || role == 'MASTER') && (
                                <div className='flex flex-col gap-4'>
                                    <div>
                                        <p className='text-realce'>Email</p>
                                        <p className='bg-input-color mr-4 py-1 rounded-md text-black pl-2'>{service?.user_mail}</p>
                                    </div>
                                    <div>
                                        <p className='text-realce'>Telefone</p>
                                        <p className='bg-input-color mr-4 py-1 rounded-md text-black pl-2'>{service?.phone}</p>
                                    </div>
                                    {service?.payment_method && (
                                        <div>
                                            <p className='text-realce'>Método de Pagamento</p>
                                            <p className='bg-input-color mr-4 py-1 rounded-md text-black pl-2'>{service?.payment_method && paymentMethodTranslate[service.payment_method]}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {(service?.status === 'PENDING' && (role === "ADMIN" || role === "MASTER")) && (
                                <Button onClick={() => updateStatusHandler('READY')} className='mt-4 bg-realce text-black font-bold hover:bg-white'>
                                    Mudar para Pronto
                                </Button>
                            )}
                            {(service?.status === 'READY' && (role === "ADMIN" || role === "MASTER")) && (
                                <div>
                                    <div className='flex flex-col items-center text-center'>
                                        <p className='p-1 text-realce text-md'>Método de Pagamento</p>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value as 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'PIX' | 'FREE')}
                                            className='input-class-name flex flex-col border-input px-3 text-black py-2 border-slate-800 border-2 rounded-lg bg-slate-200 w-full'
                                        >
                                            <option value="">Selecione o Método de Pagamento</option>
                                            <option value="CREDIT_CARD">Cartão de Crédito</option>
                                            <option value="DEBIT_CARD">Cartão de Débito</option>
                                            <option value="CASH">Dinheiro</option>
                                            <option value="PIX">PIX</option>
                                            <option value="FREE">Grátis</option>
                                        </select>
                                    </div>
                                    <Button onClick={() => updateStatusHandler('DELIVERED')} className='mt-4 bg-realce text-black font-bold hover:bg-white'>
                                        Mudar para Entregue
                                    </Button>
                                </div>
                            )}

                            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <h2>Confirmar Atualização de Status</h2>
                                    </AlertDialogHeader>
                                    <AlertDialogAction className='bg-green-600' onClick={() => whatsappLink && window.open(whatsappLink, '_blank')}>Enviar WhatsApp</AlertDialogAction>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction className='bg-realce text-black' onClick={() => setShowAlert(false)}>Confirmar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Timeline
                                nowTime={service?.now_time || undefined}
                                readyTime={service?.ready_time || undefined}
                                deliveredTime={service?.delivered_time || undefined}
                                maxTime={service?.max_time || undefined}
                            />
                            <div className='flex w-full items-center flex-col gap-4'>
                                {role === 'MASTER' && (
                                    <Button onClick={() => setShowDeleteAlert(true)} className='bg-red-600 text-white hover:bg-red-300 flex items-center w-full'>
                                        Deletar Serviço
                                    </Button>
                                )}
                            </div>
                            <div className='flex w-full items-center flex-col gap-4'>
                                {role === 'MASTER' && (
                                    <Button onClick={() => router.push(`/services/edit/${id}`)} className='bg-blue-400 text-white hover:bg-blue-200 flex items-center w-full'>
                                        Editar Serviço
                                    </Button>
                                )}
                            </div>
                            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <h2>Confirmar Exclusão de Serviço</h2>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction className='bg-red-600 text-white' onClick={handleDelete}>Deletar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>

                    <div className="bg-black w-full flex flex-col items-center gap-4 p-4">
                        <p className="text-realce font-bold">Visite nossa loja!</p>
                        <a href="https://maps.app.goo.gl/ZCcjUhyGsoxS9TUA6" target='__blank' className="underline text-white text-center">Av. Pres. Castelo Branco, 8159, Jaboatão dos Guararapes</a>
                        <div className="flex items-center gap-4">
                            <a href="https://api.whatsapp.com/send?phone=5581988145906" target='__blank'>
                                <Image
                                    src={'/whats_footer.svg'}
                                    alt="Whatsapp Realce Nordeste"
                                    width={30}
                                    height={30}
                                />
                            </a>
                            <a href="https://www.instagram.com/realce.nordeste/" target='__blank'>
                                <Image
                                    src={'/insta_footer.svg'}
                                    alt="Instagram Realce Nordeste"
                                    width={30}
                                    height={30}
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ServiceId;
