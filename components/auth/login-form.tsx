"use client";

import * as z from "zod";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import Link from "next/link";
import { login } from "@/actions/login";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Cookies from "js-cookie";
import { useUser } from "@/context/UserContext";

export const LoginForm = () => {
    const { setUser } = useUser();
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email já em uso!" : "";

    const [error, setError] = useState<string | undefined>(urlError || "");
    const [success, setSuccess] = useState<string | undefined>("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        const transformedValues = {
            ...values,
            email: values.email.toLowerCase(),
        };

        try {
            const result = await login(transformedValues.email, transformedValues.password);

            if (result.success) {
                setSuccess("Login realizado com sucesso!");
                Cookies.set('accessToken', result.accessToken, { expires: 30, path: '/', sameSite: 'lax' });
                setUser(result.user);
                router.push('/home');
            } else if (!result.emailVerified && result.email) {
                router.push(`/auth/verify?email=${encodeURIComponent(result.email)}`);
            } else if (result.error) {
                setError(result.error);
            } else {
                setError("Erro desconhecido ao realizar login.");
            }
        } catch (error) {
            console.error("Erro no submit: ", error);
            setError("Erro ao realizar login.");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="exemplo@email.com"
                                        type="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            placeholder="******"
                                            type={showPassword ? "text" : "password"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <VisibilityOffIcon className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <VisibilityIcon className="w-5 h-5 text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <Button
                                    size="sm"
                                    variant="link"
                                    asChild
                                    className="px-0 font-normal text-white underline"
                                >
                                    <Link href="/auth/forgot-password">Esqueceu a senha?</Link>
                                </Button>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {error && <FormError message={error} />}

                <Button
                    type="submit"
                    className="w-full bg-realce text-black hover:bg-white font-bold rounded-xl"
                >
                    Entrar
                </Button>
            </form>
        </Form>
    );
};
