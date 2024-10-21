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
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUser } from "@/context/UserContext";
import {OtpFormSchema} from "@/schemas";



export function VerifyCodeForm({ email }: { email: string }) {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const { setUser } = useUser();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof OtpFormSchema>>({
        resolver: zodResolver(OtpFormSchema),
        defaultValues: {
            pin: "",
            email: email,
        },
    });

    async function onSubmit(data: z.infer<typeof OtpFormSchema>) {
        setError(undefined);
        setSuccess(undefined);

        try {
            const response = await verifyCode(data.email, data.pin);

            if (!response.success) {
                setError(response.message || "Erro ao tentar verificar o código.");
                return
            } else {
                setSuccess(response.message);
                toast({
                    title: "Verificação bem-sucedida!",
                    description: "Seu e-mail foi verificado com sucesso.",
                    variant: "success",
                });
                Cookies.set('accessToken', response.accessToken, {
                    expires: 30,
                    path: '/',
                    sameSite: 'lax',
                });

                if (response.user) {
                    setUser(response.user);
                    localStorage.setItem("user", JSON.stringify(response.user));
                    router.push('/home');
                }
            }
        } catch (err) {
            setError("Erro ao tentar verificar o código.");
        }
    }

    return (
      
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center  space-y-6">
                    <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                                <FormLabel>Código de Verificação</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field} >
                                        <InputOTPGroup className="bg-gray-50/50 rounded-md text-black">
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <Button type="submit" className="bg-realce w-2/3 text-black hover:bg-realce/70">Verificar</Button>

                    {error && (
                        <div className="text-red-500 mt-2">
                            <p>{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="text-green-500 mt-2">
                            <p>{success}</p>
                        </div>
                    )}
                </form>
            </Form>
        
    );
}
