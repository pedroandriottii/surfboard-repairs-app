'use client';
import { Suspense, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ResetPasswordSchema } from '@/schemas';

function ResetPasswordForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });

  const onSubmit = async (data: { password: string, confirmPassword: string }) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, password: data.password })
        });

        const result = await response.json();
        if (response.ok) {
          setSuccess("Senha alterada com sucesso! Redirecionando...");
          setTimeout(() => router.push('/'), 3000);
        } else {
          setError(result.message || "Algo deu errado. Tente novamente.");
        }
      } catch (error) {
        setError("Erro de conexão.");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-realce-bg text-white relative overflow-hidden">
      <div className="w-full max-w-md space-y-8 px-4 relative z-10">
        <div className="flex flex-col items-center">
          <h2 className="mt-6 text-center text-3xl font-bold">Definir nova senha</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="******" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="******" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full bg-realce text-black" disabled={isPending}>
                Redefinir senha
              </Button>
            </form>
          </Form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
      </div>
    </div>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<p>Carregando</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}