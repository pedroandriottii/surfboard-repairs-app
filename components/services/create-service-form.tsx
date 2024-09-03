"use client";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentRole } from "@/hooks/use-current-role";
import { ServiceSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from 'next/navigation';
import InputMask from 'react-input-mask';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "../ui/use-toast";
import imageCompression from 'browser-image-compression';
import { Progress } from "../ui/progress";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FormSuccess } from "../form-success";
import { RoleGate } from "../auth/role-gate";
import Navbar from "../base/navbar";
import { Textarea } from "../ui/textarea";
import BackgroundImage from "../base/backgroundImage";

export const CreateServiceForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const router = useRouter();
    const role = useCurrentRole();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof ServiceSchema>>({
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

    const compressImage = async (file: File) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };
        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error("Erro ao comprimir a imagem:", error);
            throw error;
        }
    };

    const handleError = (message: string) => {
        setError(message);
        setIsPending(false);
    };

    const onSubmit = async (values: z.infer<typeof ServiceSchema>) => {
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = fileInput?.files ? fileInput.files[0] : null;

        if (!file) {
            handleError("Selecione uma imagem para o serviço.");
            return;
        }

        if (!file.type.startsWith('image')) {
            handleError("O arquivo selecionado não é uma imagem.");
            return;
        }

        setIsPending(true);

        try {
            const compressedFile = await compressImage(file);
            const uniqueFileName = `${uuidv4()}_${compressedFile.name}`;
            const storageRef = ref(storage, `images/${uniqueFileName}`);
            const uploadTask = uploadBytesResumable(storageRef, compressedFile);

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setUploadProgress(progress);
            },
                (error) => {
                    console.error(error);
                    handleError("Falha no upload da imagem.");
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        const formValues = { ...values, photo_url: downloadURL, max_time: new Date(values.max_time) };

                        try {
                            const response = await fetch('/api/services', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(formValues),
                            });

                            const result = await response.json();

                            if (response.ok) {
                                toast({
                                    title: "Sucesso!",
                                    description: "O serviço foi criado com sucesso.",
                                    variant: "success",
                                });
                                setSuccess(result.success);
                                router.push('/home');
                            } else {
                                handleError(result.error || "Erro desconhecido");
                            }
                        } catch (error) {
                            console.error("Erro ao criar serviço", error);
                            handleError("Erro ao criar serviço.");
                        }
                    });
                });
        } catch (error) {
            handleError("Erro ao comprimir a imagem.");
        }
    };


    return (
        <div className="relative w-full flex flex-col min-h-screen overflow-x-hidden">
            <BackgroundImage src="/splash.png" alt="Background" />
            <BackgroundImage src="/splash_desk.png" alt="Background" isDesktop />
            <div className="relative z-20 flex flex-col items-center w-full">
                <div className='flex justify-between w-full'>
                    <Navbar role={role} />
                </div>
                <RoleGate allowedRoles={['ADMIN', 'MASTER']}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-black p-4">
                            <h1 className="text-realce w-full py-2 rounded-xl text-xl font-bold text-center bg-transparent border border-realce">Cadastrar Serviço</h1>
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
                                        <FormLabel className="text-realce">Nome do Cliente</FormLabel>
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
                                <FormField control={form.control} name="value" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-realce">Valor do serviço</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center border w-full rounded-md h-10 border-input pl-3">
                                                <span className="mr-2 text-white">R$</span>
                                                <Input {...field} placeholder="Valor" type="number" className="flex-1" disabled={isPending} value={field.value || ''} onChange={e => form.setValue('value', e.target.valueAsNumber)} />
                                            </div>
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
                            </div>
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-realce">Descrição do serviço</FormLabel>
                                    <FormControl>
                                        <div className="grid w-full gap-1.5">
                                            <Textarea className="bg-background" {...field} placeholder="Descrição" id="message" disabled={isPending} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            {isPending && <Progress value={uploadProgress} />}
                            <FormError message={error} />
                            <FormSuccess message={success} />
                            <Button type="submit" className="w-full bg-realce text-black hover:bg-white" disabled={isPending}>
                                Cadastrar
                            </Button>
                        </form>
                    </Form>
                </RoleGate>
            </div>
        </div>
    );
};