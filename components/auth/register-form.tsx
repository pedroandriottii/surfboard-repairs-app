'use client';

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import { register } from "@/actions/register";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import InputMask from 'react-input-mask';
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FormSuccess } from "../form-success";
import { useToast } from "@/hooks/use-toast";
import { VerifyCodeForm } from "./verification-form";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [isEmailVerified, setIsEmailVerified] = useState<boolean>(true);
    const [verificationEmail, setVerificationEmail] = useState<string | undefined>();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            phone: "",
        }
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        const transformedValues = {
            ...values,
            email: values.email.toLowerCase(),
            phone: values.phone.replace(/\D/g, ''),
        };

        startTransition(() => {
            register(transformedValues).then((data) => {
                setError(data.error);
                setSuccess(data.success);

                if (data.success) {
                    toast({
                        title: "Registro bem-sucedido!",
                        description: "Verifique seu e-mail para continuar.",
                        variant: "success",
                    });

                    setIsEmailVerified(false);
                    setVerificationEmail(values.email);
                }
            });
        });
    };

    if (!isEmailVerified && verificationEmail) {
        return (
            <VerifyCodeForm email={verificationEmail} />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 mb-4">
                <div className="h-2 flex-1 rounded bg-realce"></div>
                <div className="h-2 flex-1 rounded bg-gray-300"></div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-realce">Nome</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="João Silva" type="text" disabled={isPending} className="bg-input-color text-black" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-realce">Email</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="exemplo@email.com" type="email" disabled={isPending} className="bg-input-color text-black" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-realce">Telefone</FormLabel>
                                <FormControl>
                                    <InputMask mask="+5\5 (99) 99999-9999" {...field} placeholder="(99) 99999-9999" required disabled={isPending} className="pl-3 bg-input-color py-2 rounded-md text-black" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-realce">Senha</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="******" type="password" disabled={isPending} className="bg-input-color text-black" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button type="submit" className="w-full bg-realce text-black font-bold hover:bg-realce/50" disabled={isPending}>
                        Cadastrar
                    </Button>
                </form>
            </Form>
        </div>
    );
};
