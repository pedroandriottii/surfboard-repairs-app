"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyCode } from "@/actions/verify-code";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "O código OTP deve ter 6 dígitos.",
    }),
    email: z.string().email({ message: "Insira um email válido." }),
});

export function VerifyCodeForm() {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
            email: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setError(undefined);
        setSuccess(undefined);

        try {
            const response = await verifyCode(data.email, data.pin);
            if (response.error) {
                setError(response.error);
            } else {
                setSuccess(response.success);
                toast({
                    title: "Verificação bem-sucedida!",
                    description: "Seu e-mail foi verificado com sucesso.",
                    variant: "success",
                });
                router.push("/home")
            }
        } catch (err) {
            setError("Erro ao verificar o código.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                {/* Campo de Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="exemplo@email.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Insira o e-mail que você utilizou para cadastro.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Código de Verificação</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormDescription>
                                Insira o código de 6 dígitos enviado para o seu e-mail.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Verificar</Button>

                {error && (
                    <div className="text-red-500 mt-2">
                        <FormMessage>{error}</FormMessage>
                    </div>
                )}
                {success && (
                    <div className="text-green-500 mt-2">
                        <FormMessage>{success}</FormMessage>
                    </div>
                )}
            </form>
        </Form>
    );
}
