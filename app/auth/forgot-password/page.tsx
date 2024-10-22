'use client'
import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const ResetPasswordSchema = z.object({
  email: z.string().email({ message: "Email inválido" })
});

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: "" }
  });

  const onSubmit = async (data: { email: string }) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email })
        });
        const result = await response.json();
        if (response.ok) {
          setSuccess("Email enviado com sucesso! Verifique sua caixa de entrada.");
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
      <div className="md:hidden absolute inset-0">
      </div>
      <div className="w-full max-w-md space-y-8 px-4 relative z-10">
        <div className="flex flex-col items-center">
          <Image
            src={'/realce_logo.png'}
            alt="Realce Nordeste"
            width={100}
            height={100}
          />
          <h2 className="mt-6 text-center text-3xl font-bold">
            Esqueceu a senha?
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite seu email" type="email" className='text-black' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <button
                type="submit"
                className="mt-6 w-full bg-realce text-black font-bold py-2 rounded-md"
                disabled={isPending}
              >
                Enviar email
              </button>
            </form>
          </Form>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <Link className='underline mt-4' href={'/'}>Voltar ao início.</Link>
        </div>
      </div>
    </div>
  );
}