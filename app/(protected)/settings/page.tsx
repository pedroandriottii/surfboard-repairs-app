"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SettingsSchema } from "@/schemas"
import { settings } from "@/actions/settings"
import { useSession } from "next-auth/react";
import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/hooks/use-current-user"
import { FormSuccess } from "@/components/form-success"
import { FormError } from "@/components/form-error"
import BackgroundImage from "@/components/base/backgroundImage"
import Navbar from "@/components/base/navbar"
import EditIcon from '@mui/icons-material/Edit';
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const SettingsPage = () => {
    const user = useCurrentUser();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const { update } = useSession();

    const [isNameEditable, setIsNameEditable] = useState(false);
    const [isEmailEditable, setIsEmailEditable] = useState(false);
    const [isPasswordEditable, setIsPasswordEditable] = useState(false);
    const isAnyEditable = isNameEditable || isEmailEditable || isPasswordEditable;

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name: user?.name || undefined,
            email: user?.email || undefined,
        }
    })

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        startTransition(() => {
            settings(values).then((data) => {
                if (data.error) {
                    setError(data.error);
                }
                if (data.success) {
                    update()
                    setSuccess(data.success);
                }
            }).catch(() => setError("Algo deu errado"))
        })
    }

    return (
        <div className='relative w-full flex-grow h-full min-h-screen'>
            <BackgroundImage src="/splash.webp" alt="Background" />
            <BackgroundImage src="/splash_desk.webp" alt="Background" isDesktop />
            <div className="relative z-20 flex flex-col items-center w-full gap-4">
                <div className='flex justify-between w-full'>
                    <Navbar />
                </div>
                <div className="w-full px-4">
                    <h1 className="text-realce w-full py-2 rounded-xl text-xl font-bold text-center bg-transparent border border-realce">Configurações da Conta</h1>
                </div>
                <Form {...form}>
                    <form className="space-y-6 w-full p-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem className="relative">
                                    <FormLabel className="text-realce">
                                        Nome
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="John Doe" disabled={!isNameEditable || isPending} />
                                    </FormControl>
                                    <button
                                        type="button"
                                        onClick={() => setIsNameEditable(!isNameEditable)}
                                        className="absolute right-2 top-8"
                                    >
                                        <EditIcon className="h-5 w-5 text-realce" />
                                    </button>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {user?.isOAuth === false && (
                                <>
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel className="text-realce">
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="john.doe@example.com" type="email" disabled={!isEmailEditable || isPending} />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => setIsEmailEditable(!isEmailEditable)}
                                                className="absolute right-2 top-8"
                                            >
                                                <EditIcon className="h-5 w-5 text-realce" />
                                            </button>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="password" render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel className="text-realce">
                                                Senha
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="******" type="password" disabled={!isPasswordEditable || isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="newPassword" render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel className="text-realce">
                                                Nova Senha
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="******" type="password" disabled={!isPasswordEditable || isPending} />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => setIsPasswordEditable(!isPasswordEditable)}
                                                className="absolute right-2 top-8"
                                            >
                                                <EditIcon className="h-5 w-5 text-realce" />
                                            </button>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </>
                            )}
                        </div>

                        <FormError message={error as string} />
                        <FormSuccess message={success as string} />

                        {isAnyEditable && (
                            <Button type="submit" disabled={isPending} className="bg-realce text-black hover:bg-realce/70 w-full">
                                Salvar
                            </Button>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default SettingsPage;