"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SettingsSchema } from "@/schemas"
import { settings } from "@/actions/settings"
import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card"
import { useSession } from "next-auth/react";
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { FormSuccess } from "@/components/form-success"
import { FormError } from "@/components/form-error"

const SettingsPage = () => {
    const user = useCurrentUser();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const { update } = useSession();

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
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
            }).catch(() => setError("Something went wrong"))
        })
    }

    return (
        <Card>
            <CardHeader>
                <p>Configurações</p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Nome
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="John Doe" disabled={isPending} />

                                    </FormControl>
                                </FormItem>
                            )} />
                        </div>
                        <FormError message={error as string} />
                        <FormSuccess message={success as string} />
                        <Button type="submit" disabled={isPending}>
                            Salvar
                        </Button>
                    </form>
                </Form>
            </CardContent>

        </Card>
    )
}

export default SettingsPage;