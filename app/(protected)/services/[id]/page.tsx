'use client';
import { getServiceById } from '@/data/services';
import { Service } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Link from 'next/link';
import { useCurrentRole } from '@/hooks/use-current-role';
import { toast } from 'react-toastify';
import { ChangeStatusSchema, ServiceSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { UserButton } from '@/components/auth/user-button';
import * as z from 'zod';
import { updateStatus } from '@/actions/update-status';
import { deleteService } from '@/actions/delete-service';
import { editService } from '@/actions/edit-service';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import Timeline from '@/components/services/timeline';
import { Input } from '@/components/ui/input';

const ServiceId = () => {
    const [service, setService] = useState<Service | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const pathName = usePathname();
    const role = useCurrentRole();
    const router = useRouter();

    const form = useForm<z.infer<typeof ChangeStatusSchema>>({
        resolver: zodResolver(ChangeStatusSchema),
    });

    const editForm = useForm<z.infer<typeof ServiceSchema>>({
        resolver: zodResolver(ServiceSchema),
        defaultValues: service || {},
    });

    const id = pathName.replace('/services/', '');

    const statusTranslate = {
        PENDING: 'Pendente',
        READY: 'Pronto',
        DELIVERED: 'Entregue',
    };

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
                editForm.reset({
                    photo_url: fetchedService?.photo_url || null,
                    client_name: fetchedService?.client_name || '',
                    user_mail: fetchedService?.user_mail || '',
                    phone: fetchedService?.phone || '',
                    value: fetchedService?.value || 0,
                    max_time: fetchedService?.max_time || new Date(),
                    description: fetchedService?.description || '',
                    payment_method: fetchedService?.payment_method || 'CASH',
                });
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

    const onSubmit = async (values: z.infer<typeof ChangeStatusSchema>) => {
        const formValues = { ...values };
        const currentDate = new Date();

        if (values.status === 'READY') {
            formValues.ready_time = currentDate;
        } else if (values.status === 'DELIVERED') {
            formValues.delivered_time = currentDate;
        }

        try {
            const result = await updateStatus(id, formValues);
            if (result.success) {
                toast.success("Status Atualizado com sucesso");
                const link = generateWhatsAppLink(service?.phone, values.status);
                setWhatsappLink(link);
                setShowAlert(true);
            } else {
                toast.error('Erro ao mudar o Status: ' + result.error);
            }
        } catch (error) {
            setError("Erro ao mudar o Status: " + error);
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
            setError("Erro ao deletar serviço: " + error);
            toast.error('Erro ao deletar serviço');
        }
    };

    const handleEdit = async (values: z.infer<typeof ServiceSchema>) => {
        try {
            const result = await editService(id, values);
            if (result.success) {
                toast.success("Serviço editado com sucesso");
                setService(result.service);
            } else {
                toast.error('Erro ao editar serviço: ' + result.error);
            }
        } catch (error) {
            setError("Erro ao editar serviço: " + error);
            toast.error('Erro ao editar serviço');
        }
    };

    return (
        <div className="relative w-full flex-grow h-full min-h-screen">
            <div className="relative w-full flex-grow">
                <div className="absolute inset-0 md:hidden">
                    <Image
                        src={'/splash.png'}
                        alt="Background"
                        layout="fill"
                        className="object-cover h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-black via-black/85"></div>
                </div>
                <div className="hidden md:block absolute inset-0">
                    <Image
                        src={'/splash_desk.png'}
                        alt="Background"
                        layout="fill"
                        className="object-cover h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-black via-black/85"></div>
                </div>
                <div className="relative z-20 flex flex-col items-center w-full">
                    <div className='flex justify-between w-full md:pr-4 p-4'>
                        <Image
                            src={'/realce_logo.png'}
                            alt="Realce Nordeste"
                            width={50}
                            height={50}
                        />
                        <div className='flex gap-4 items-center'>
                            <Link href={'/home'}>
                                <Button className='bg-transparent border-2 border-realce text-realce hover:bg-white max-h-8 rounded-xl hover:text-black hover:border-none hover:transition-all'>
                                    Serviços
                                </Button>
                            </Link>

                            {role == 'MASTER' && (
                                <div className='flex items-center gap-4'>
                                    <Link href={'/dashboard'}>
                                        <Button className='bg-transparent border-2 border-realce text-realce hover:bg-white max-h-8 rounded-xl hover:text-black hover:border-none hover:transition-all'>
                                            Finanças
                                        </Button>
                                    </Link>
                                </div>
                            )}
                            <UserButton />
                        </div>
                    </div>
                    <div className='w-full h-full flex flex-col gap-4'>
                        <Link href={'/home'} className='bg-realce rounded-r-full flex w-1/4 font-bold md:w-1/12'>
                            <ChevronLeftIcon />
                            <p className='text-black pl-4 justify-self-start'>Voltar</p>
                        </Link>
                        <div className='flex flex-col text-white w-full h-full items-center md:flex-row md:p-8'>
                            <div className="relative w-2/3 items-center md:w-1/2" style={{ aspectRatio: '1/1' }}>
                                <Image
                                    src={service?.photo_url ?? '/placeholder.png'}
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
                                        <div>
                                            <p className='text-realce'>Método de Pagamento</p>
                                            <p className='bg-input-color mr-4 py-1 rounded-md text-black pl-2'>{service?.payment_method && paymentMethodTranslate[service.payment_method]}</p>
                                        </div>
                                    </div>
                                )}
                                {(service?.status === 'READY' || service?.status === 'PENDING') && (role === "ADMIN" || role === "MASTER") && (
                                    <div>
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2 mr-4'>
                                                <FormField control={form.control} name="status" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            <FormControl>
                                                                <div className='flex flex-col items-center text-center'>
                                                                    <p className='p-1 text-realce text-md'>Atualizar Status</p>
                                                                    <select {...field} name="status" className='input-class-name flex flex-col border-input px-3 text-black py-2 border-slate-800 border-2 rounded-lg bg-slate-200 w-full'>
                                                                        <option value="PENDING">Selecione o Status</option>
                                                                        <option value="READY">Pronto</option>
                                                                        <option value="DELIVERED">Entregue</option>
                                                                    </select>
                                                                </div>
                                                            </FormControl>
                                                        </FormLabel>
                                                    </FormItem>
                                                )} />
                                                <Button type="submit" className='mt-4 bg-realce text-black font-bold hover:bg-white'>
                                                    Confirmar
                                                </Button>
                                            </form>
                                        </Form>
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
                                    </div>
                                )}

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
                                    {/* <Button onClick={() => editForm.handleSubmit(handleEdit)()} className='bg-blue-600 text-white'>
                                        Editar
                                    </Button> */}
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

                                {/* <Form {...editForm}>
                                    <form onSubmit={editForm.handleSubmit(handleEdit)} className='flex flex-col gap-2'>
                                        <FormField control={editForm.control} name="client_name" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cliente</FormLabel>
                                                <FormControl>
                                                    <Input {...field} value={field.value ?? ''} />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={editForm.control} name="value" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Valor</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={editForm.control} name="description" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descrição</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={editForm.control} name="photo_url" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>URL da Foto</FormLabel>
                                                <FormControl>
                                                    <Input {...field} value={field.value ?? ''} />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        <Button type="submit" className='mt-4 bg-blue-600 text-white'>
                                            Salvar
                                        </Button>
                                    </form>
                                </Form> */}

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
            </div>
        </div >
    );
};

export default ServiceId;
