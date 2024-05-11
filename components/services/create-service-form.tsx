"use client";

import * as z from "zod";

import { useState, useTransition } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ServiceSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";

import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    })

    const paymentMethodOptions = {
        CASH: "Dinheiro",
        CREDIT_CARD: "Cartão de Crédito",
        DEBIT_CARD: "Cartão de Débito",
        PIX: "PIX",
        FREE: "Grátis",
    }

    const [imgURL, setImgURL] = useState("");
    const [progress, setProgress] = useState(0);

    const onSubmit = async (values: z.infer<typeof ServiceSchema>) => {

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = fileInput?.files ? fileInput.files[0] : null;

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
                                setTimeout(() => {
                                    router.push("/services");
                                }, 4000);
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
        <div className="flex items-center align-center justify-center m-2">
            <ToastContainer position="top-center" autoClose={9000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <RoleGate allowedRole="ADMIN">
                <CardWrapper headerLabel="Registrar Conserto" backButtonLabel="Voltar" backButtonHref="/services">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
                            <div className="space-y-4">
                                <FormField control={form.control} name="photo_url" render={({ field }) => {
                                    const { value, ...inputProps } = field;
                                    return (
                                        <FormItem>
                                            <FormLabel>Foto</FormLabel>
                                            <FormControl>
                                                <Input {...inputProps} type="file" disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }} />
                                <FormField control={form.control} name="client_name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do Ciente</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="João Silva" type="name" disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="user_mail" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email do Cliente</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="exemplo@email.com" type="email" disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone do Cliente</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="(81) 98765-4321" type="text" pattern="\d*" disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="value" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor do serviço</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center border w-full rounded-md h-10 border-input pl-3">
                                                <span className="mr-2">R$</span>
                                                <Input {...field} placeholder="Valor" type="number" className="flex-1" disabled={isPending} onChange={e => form.setValue('value', e.target.valueAsNumber)} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="max_time" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prazo</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="date" disabled={isPending} onChange={(e) => { const selectedDate = new Date(e.target.value); form.setValue("max_time", selectedDate); }} value={field.value ? field.value.toISOString().substring(0, 10) : ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField control={form.control} name="description" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição do serviço</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Descrição" type="text" disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="payment_method" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Método de Pagamento</FormLabel>
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
                            </div>
                            <FormError message={error} />
                            <FormSuccess message={success} />
                            <Button type="submit" className="w-full" disabled={isPending}>
                                Confirmar
                            </Button>
                        </form>
                    </Form>
                </CardWrapper>
            </RoleGate>
        </div>

    )
}