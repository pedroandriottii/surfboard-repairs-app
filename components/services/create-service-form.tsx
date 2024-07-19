"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserButton } from "../auth/user-button";
import { ServiceSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from 'react-input-mask';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FormSuccess } from "../form-success";
import { createService } from "@/actions/create-service";
import { RoleGate } from "../auth/role-gate";

export const CreateServiceForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const role = useCurrentRole();

    const form = useForm<z.infer<typeof ServiceSchema>>({
        resolver: zodResolver(ServiceSchema),
        defaultValues: {
            user_mail: "",
            client_name: "",
            phone: "",
            value: 0,
            description: "",
            payment_method: "CASH",
            photo_url: "",
        }
    });

    const paymentMethodOptions = {
        CASH: "Dinheiro",
        CREDIT_CARD: "Cartão de Crédito",
        DEBIT_CARD: "Cartão de Débito",
        PIX: "PIX",
        FREE: "Grátis",
    };

    const [imgURL, setImgURL] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (form.watch("payment_method") === "FREE") {
            form.setValue("value", 0);
        }
    }, [form.watch("payment_method")]);

    const onSubmit = async (values: z.infer<typeof ServiceSchema>) => {
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = fileInput?.files ? fileInput.files[0] : null;

        if (values.payment_method === 'FREE') {
            values.value = 0;
        }

        if (file) {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
                (error) => {
                    console.error(error);
                    setError("Falha no upload da imagem.")
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                        const formValues = { ...values, photo_url: downloadURL };

                        createService(formValues).then(result => {
                            if (result.success) {
                                toast.success("Serviço criado com sucesso!")
                                setSuccess(result.success);
                                router.push('/home');
                            } else {
                                setError(result.error);
                                toast.error('Erro ao criar o serviço: ' + result.error);
                            }

                        }).catch(error => {
                            console.error("Erro ao criar serviço", error);
                            setError("Erro ao criar serviço.")
                            toast.error('Erro ao criar o serviço: ' + error);
                        })
                    })
                })
        } else {
            setError("Selecione uma imagem para o serviço.")
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-black p-4">
            <div className='flex justify-between w-full'>
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
                                <Button className='bg-transparent border-2 border-realce text-realce hover:bg-white max-h-8 rounded-xl hover:text-black hover:border-none hover:transition-all' >
                                    Finanças
                                </Button>
                            </Link>
                        </div>
                    )}
                    <UserButton />
                </div>
            </div>
            <h1 className="text-realce text-xl font-bold py-2 text-center">Cadastrar Serviço</h1>
            <ToastContainer position="top-center" autoClose={9000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <RoleGate allowedRoles={['ADMIN', 'MASTER']}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-black">
                        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4">
                            <FormField control={form.control} name="photo_url" render={({ field }) => {
                                const { value, ...inputProps } = field;
                                return (
                                    <FormItem>
                                        <FormLabel className="text-realce">Foto da Prancha</FormLabel>
                                        <FormControl>
                                            <Input {...inputProps} type="file" disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }} />
                            <FormField control={form.control} name="client_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-realce">Nome do Ciente</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="João Silva" type="name" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="user_mail" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-realce">Email do Cliente</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="exemplo@email.com" type="email" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem className="flex flex-col gap-2">
                                    <FormLabel className="text-realce">Telefone do Cliente</FormLabel>
                                    <FormControl>
                                        <InputMask mask="+5\5 (99) 99999-9999" {...field} className="border rounded-md p-2 w-full" placeholder='+55 (99) 99999-9999' required disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-realce">Descrição do serviço</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Descrição" type="text" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="max_time" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-realce">Prazo</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="date" disabled={isPending} onChange={(e) => { const selectedDate = new Date(e.target.value); form.setValue("max_time", selectedDate); }} value={field.value ? field.value.toISOString().substring(0, 10) : ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField control={form.control} name="payment_method" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-realce">Método de Pagamento</FormLabel>
                                    <FormControl>
                                        <select {...field} disabled={isPending} className="input-class-name flex flex-col border w-full rounded-md h-10 border-input px-3 py-2">
                                            {Object.entries(paymentMethodOptions).map(([value, name]) => (
                                                <option key={value} value={value}>{name}</option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="value" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-realce">Valor do serviço</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center border w-full rounded-md h-10 border-input pl-3">
                                            <span className="mr-2 text-white">R$</span>
                                            <Input {...field} placeholder="Valor" type="number" className="flex-1" disabled={form.watch("payment_method") === "FREE" || isPending} onChange={e => form.setValue('value', e.target.valueAsNumber)} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button type="submit" className="w-full bg-realce text-black hover:bg-white" disabled={isPending}>
                            Confirmar
                        </Button>
                    </form>
                </Form>
            </RoleGate>
        </div>
    );
};
