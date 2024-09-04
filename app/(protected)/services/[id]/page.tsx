'use client';
import { getServiceById } from '@/data/services';
import { Service } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Link from 'next/link';
import { useCurrentRole } from '@/hooks/use-current-role';
import Image from 'next/image';
import { updateStatus } from '@/actions/update-status';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import Timeline from '@/components/services/timeline';
import Navbar from '@/components/base/navbar';
import BackgroundImage from '@/components/base/backgroundImage';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Footer from '@/components/base/footer';
import { useToast } from '@/components/ui/use-toast';

const ServiceId = () => {
    const [service, setService] = useState<Service | null>(null);
    const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<'READY' | 'DELIVERED' | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'PIX' | 'FREE' | undefined>(undefined);
    const pathName = usePathname();
    const role = useCurrentRole();
    const router = useRouter();
    const id = pathName.replace('/services/', '');
    const { toast } = useToast();

    const paymentMethodTranslate = {
        CREDIT_CARD: 'Cartão de Crédito',
        DEBIT_CARD: 'Cartão de Débito',
        CASH: 'Dinheiro',
        PIX: 'PIX',
        FREE: 'Grátis',
    };

    useEffect(() => {
        if (typeof id === 'string') {
            fetchService();
        }
    }, [id]);

    const fetchService = async () => {
        const fetchedService = await getServiceById(id);
        setService(fetchedService);
    };


    const generateWhatsAppLink = (phone?: string, status?: string) => {
        if (!phone) return null;

        const cleanedPhone = phone.replace(/\D/g, '');

        const baseMessage = 'Olá! Sua prancha ';
        const statusMessage = status === 'DELIVERED' ? 'foi entregue!' : 'está pronta para ser retirada!';
        return `https://api.whatsapp.com/send?phone=${cleanedPhone}&text=${baseMessage}${statusMessage}`;
    };

    const updateStatusHandler = async () => {
        if (!pendingStatus) return;

        const formValues: { status: 'READY' | 'DELIVERED'; ready_time?: Date; delivered_time?: Date; payment_method?: 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'PIX' | 'FREE' } = { status: pendingStatus };
        const currentDate = new Date();

        if (pendingStatus === 'READY') {
            formValues.ready_time = currentDate;
        } else if (pendingStatus === 'DELIVERED') {
            formValues.delivered_time = currentDate;
            formValues.payment_method = paymentMethod;
            if (!paymentMethod) {
                toast({
                    title: "Erro",
                    description: "Método de pagamento é obrigatório ao entregar",
                    variant: "destructive",
                })
                return;
            }
        }

        try {
            const result = await updateStatus(id, formValues);
            if (result.success) {
                toast({
                    title: "Sucesso",
                    description: "Status atualizado com sucesso",
                    variant: "success",
                });
                fetchService();
                const link = generateWhatsAppLink(service?.phone, pendingStatus);
                setWhatsappLink(link);
                setShowAlert(false);
                setPendingStatus(null);

                if (link) {
                    window.open(link, '_blank');
                }
            } else {
                toast({
                    title: "Erro",
                    description: `Erro ao mudar o Status: ${result.error}`,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao mudar o Status",
                variant: "destructive",
            })
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/services/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    title: "Sucesso",
                    description: "Serviço deletado com sucesso",
                    variant: "success",
                });
                router.push('/home');
            } else {
                toast({
                    title: "Erro",
                    description: `Erro ao deletar serviço: ${result.error || "Erro desconhecido"}`,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao deletar serviço",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="relative w-full flex flex-col min-h-screen overflow-x-hidden">
            <BackgroundImage src="/splash.webp" alt="Background" />
            <BackgroundImage src="/splash_desk.webp" alt="Background" isDesktop />
            <div className="relative z-20 flex flex-col items-center w-full">
                <div className='flex justify-between w-full md:pr-4'>
                    <Navbar />
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
                                    <p className='bg-input-color py-1 rounded-md text-black pl-2'>{service?.client_name}</p>
                                </div>
                                <div className='md:w-1/2'>
                                    <p className='text-realce'>Valor</p>
                                    <p className='bg-input-color py-1 rounded-md text-black pl-2'>R$ {service?.value}</p>
                                </div>
                            </div>
                            <div>
                                <p className='text-realce'>Descrição</p>
                                <p className='bg-input-color py-1 rounded-md text-black pl-2'>{service?.description}</p>
                            </div>

                            {(role == 'ADMIN' || role == 'MASTER') && (
                                <div className='flex flex-col gap-4'>
                                    <div>
                                        <p className='text-realce'>Email</p>
                                        <p className='bg-input-color py-1 rounded-md text-black pl-2'>{service?.user_mail}</p>
                                    </div>
                                    <div>
                                        <p className='text-realce'>Telefone</p>
                                        <p className='bg-input-color py-1 rounded-md text-black pl-2'>{service?.phone}</p>
                                    </div>
                                    {service?.payment_method && (
                                        <div>
                                            <p className='text-realce'>Método de Pagamento</p>
                                            <p className='bg-input-color py-1 rounded-md text-black pl-2'>{service?.payment_method && paymentMethodTranslate[service.payment_method]}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {(service?.status === 'PENDING' && (role === "ADMIN" || role === "MASTER")) && (
                                <Button onClick={() => { setPendingStatus('READY'); setShowAlert(true); }} className='mt-4 bg-realce text-black font-bold hover:bg-white'>
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
                                    <Button onClick={() => { setPendingStatus('DELIVERED'); setShowAlert(true); }} className='mt-4 bg-realce text-black font-bold hover:bg-white'>
                                        Mudar para Entregue
                                    </Button>
                                </div>
                            )}

                            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmar Atualização de Status</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction className='bg-realce text-black' onClick={updateStatusHandler}>
                                            Enviar WhatsApp e Confirmar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Timeline
                                nowTime={service?.now_time || undefined}
                                readyTime={service?.ready_time || undefined}
                                deliveredTime={service?.delivered_time || undefined}
                                maxTime={service?.max_time || undefined}
                            />
                            <div className='flex w-full gap-4'>
                                {role === 'MASTER' && (
                                    <Button onClick={() => router.push(`/services/edit/${id}`)} className='bg-blue-400 text-white hover:bg-blue-200 flex items-center w-full gap-2'>
                                        <EditIcon />
                                        Editar
                                    </Button>
                                )}
                                {role === 'MASTER' && (
                                    <Button onClick={() => setShowDeleteAlert(true)} className='bg-red-600 text-white hover:bg-red-300 flex items-center w-full gap-2'>
                                        <DeleteIcon />
                                        Deletar
                                    </Button>
                                )}
                            </div>
                            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction className='bg-red-600 text-white' onClick={handleDelete}>Deletar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </div >
    );
};

export default ServiceId;
