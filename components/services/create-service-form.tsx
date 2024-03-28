"use client";

import * as z from "zod";

import { useState, useTransition} from "react";
import { CardWrapper } from "@/components/auth/card-wrapper"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ServiceSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";

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

export const CreateServiceForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof ServiceSchema>>({
        resolver: zodResolver(ServiceSchema),
        defaultValues: {
            user_mail: "",
            client_name: "",
            phone: "",
            value: 0,
            description: "",
            payment_method: "CASH",
            status: "PENDING",
        }
    })

    const onSubmit = async (values: z.infer<typeof ServiceSchema>) => {
        const result = await createService(values);
        if (result.success) {
            setSuccess(result.success);
        } else {
            setError(result.error);
        }
    };
    

    return (
        <CardWrapper headerLabel="Registrar Conserto" backButtonLabel="Voltar" backButtonHref="/auth/login" showSocial>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
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
                                <FormLabel>Valor</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Valor" type="number" disabled={isPending} onChange={e => form.setValue('value', e.target.valueAsNumber)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="max_time" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Prazo</FormLabel>
                            <FormControl>
                                <Input {...field} type="date" disabled={isPending} onChange={(e) => {const selectedDate = new Date(e.target.value); form.setValue("max_time", selectedDate);}} value={field.value ? field.value.toISOString().substring(0,10): ''}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descrição</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Valor" type="text" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="payment_method" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Método de Pagamento</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Valor" type="text" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Valor" type="text" disabled={isPending} />
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
    )
}