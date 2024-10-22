"use client";

import * as z from "zod";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import Link from "next/link";
import { login } from "@/actions/login";
import Cookies from "js-cookie";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FormSuccess } from "@/components/form-success";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useUser } from "@/context/UserContext";
import { VerifyCodeForm } from "./verification-form";

export const LoginForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email já em uso!" : "";

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState<boolean>(true);
    const [verificationEmail, setVerificationEmail] = useState<string | undefined>();
    const { setUser } = useUser();

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

            console.log("Resultado do login:", result);
            console.log("EMAIL VERIFICADO? ", result.emailVerified)

            if (result.success && result.emailVerified) {
                setSuccess("Login realizado com sucesso!");

                Cookies.set('accessToken', result.accessToken, {
                    expires: 30,
                    path: '/',
                    sameSite: 'lax',
                });

                if (result.user) {
                    setUser(result.user);
                    localStorage.setItem("user", JSON.stringify(result.user));
                    router.push('/home');
                }
            }
            else if (!result.emailVerified) {
                setIsEmailVerified(false);
                setVerificationEmail(values.email);
            }
            else if (result.error) {
                setError(result.error);
            } else {
                setError("Erro desconhecido ao realizar login.");
            }
        } catch (error) {
            console.error("Erro no submit: ", error);
            setError("Erro ao realizar login.");
        }
    };

    if (!isEmailVerified && verificationEmail) {
        return (
            <CardWrapper
                headerTitle="Verificação de E-mail"
                headerLabel="Insira o código de 6 dígitos enviado para o seu e-mail.">
                <VerifyCodeForm email={verificationEmail} />
            </CardWrapper>
        );
    }

    return (
        <CardWrapper
            headerTitle="Login"
            headerLabel="Entre na sua conta e acompanhe o andamento do seu conserto!"
            backButtonLabel="Não tem uma conta? Cadastre-se"
            backButtonHref="/auth/register"
            showSocial
        >
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
                                            className="bg-input-color text-black"
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
                                                className="bg-input-color text-black pr-10"
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
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button
                        type="submit"
                        className="w-full bg-realce text-black hover:bg-white font-bold rounded-xl"
                    >
                        Entrar
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
