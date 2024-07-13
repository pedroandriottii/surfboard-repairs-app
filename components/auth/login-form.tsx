"use client";

import * as z from "zod";

import { useSearchParams } from "next/navigation"
import { useState, useTransition } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import Link from "next/link";

import { login } from "@/actions/login"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FormSuccess } from "../form-success";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const LoginForm = () => {
    const searchParamns = useSearchParams();
    const urlError = searchParamns.get("error") === "OAuthAccountNotLinked" ? "Email já em uso!" : "";

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        const transformedValues = {
            ...values,
            email: values.email.toLowerCase(),
        };

        startTransition(() => {
            login(transformedValues).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            });
        });
    };

    return (
        <CardWrapper headerTitle="Login" headerLabel="Entre na sua conta e acompanhe o andamento do seu conserto!" backButtonLabel="Não tem uma conta? Cadastre-se" backButtonHref="/auth/register" showSocial>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="exemplo@email.com" type="email" disabled={isPending} className="bg-input-color text-black" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input {...field} placeholder="******" type={showPassword ? "text" : "password"} disabled={isPending} className="bg-input-color text-black pr-10" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
                                        >
                                            {showPassword ? <VisibilityOffIcon className="w-5 h-5 text-gray-500" /> : <VisibilityIcon className="w-5 h-5 text-gray-500" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <Button size="sm" variant="link" asChild className="px-0 font-normal text-white underline">
                                    <Link href="/auth/reset">
                                        Esqueceu a senha?
                                    </Link>
                                </Button>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button type="submit" className="w-full bg-realce text-black hover:bg-white font-bold rounded-xl" disabled={isPending}>
                        Entrar
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
