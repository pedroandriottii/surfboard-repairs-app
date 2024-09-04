'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ServiceSchema } from '@/schemas';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { getServiceById } from '@/data/services';
import { Service } from '@prisma/client';
import { editService } from '@/actions/edit-service';
import * as z from 'zod';
import Navbar from '@/components/base/navbar';
import BackgroundImage from '@/components/base/backgroundImage';

type FormValues = z.infer<typeof ServiceSchema>;

const EditService = () => {
    const router = useRouter();
    const pathName = usePathname();
    const id = pathName.replace('/services/edit/', '');
    const [service, setService] = useState<Service | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(ServiceSchema),
        defaultValues: {
            user_mail: "",
            client_name: "",
            phone: "",
            value: undefined,
            description: "",
            photo_url: "",
            max_time: new Date(),
        }
    });

    useEffect(() => {
        if (typeof id === 'string') {
            const fetchService = async () => {
                const fetchedService = await getServiceById(id);
                setService(fetchedService);
                if (fetchedService) {
                    Object.keys(fetchedService).forEach((key) => {
                        form.setValue(key as keyof FormValues, fetchedService[key as keyof typeof fetchedService]);
                    });
                }
            };
            fetchService();
        }
    }, [id, form]);

    const onSubmit = async (data: FormValues) => {
        if (typeof id === 'string') {
            const result = await editService(id, data);
            if (result.success) {
                router.push(`/services/${id}`);
            } else {
                console.error('Erro ao atualizar serviço', result.error);
            }
        }
    };

    if (!service) {
        return <div>Loading...</div>;
    }

    return (
        <div className='relative w-full flex-grow h-full min-h-screen'>
            <BackgroundImage src="/splash.webp" alt="Background" />
            <BackgroundImage src="/splash_desk.webp" alt="Background" isDesktop />
            <div className="relative z-20 flex flex-col items-center w-full">
                <div className='flex justify-between w-full md:pr-4'>
                    <Navbar />
                </div>
                <h1>Editar Serviço</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="user_mail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Email do Usuário</FormLabel>
                                    <FormControl>
                                        <input type="email" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="client_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Nome do Cliente</FormLabel>
                                    <FormControl>
                                        <input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Telefone</FormLabel>
                                    <FormControl>
                                        <input type="tel" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Valor</FormLabel>
                                    <FormControl>
                                        <input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Descrição</FormLabel>
                                    <FormControl>
                                        <textarea {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                        control={form.control}
                        name="photo_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL da Foto</FormLabel>
                                <FormControl>
                                    <input type="url" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    /> */}
                        <FormField
                            control={form.control}
                            name="max_time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Data e Hora Máxima</FormLabel>
                                    <FormControl>
                                        <input
                                            type="datetime-local"
                                            {...field}
                                            value={field.value instanceof Date ? field.value.toISOString().slice(0, 16) : ''}
                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Salvar</Button>
                    </form>
                </Form>
            </div>
        </div >
    );
};

export default EditService;