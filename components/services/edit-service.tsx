"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ServiceSchema } from '@/schemas';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getServiceById } from '@/data/services';
import { Service } from '@prisma/client';
import { editService } from '@/actions/edit-service';
import * as z from 'zod';
import Navbar from '@/components/base/navbar';
import BackgroundImage from '@/components/base/backgroundImage';
import { useCurrentRole } from "@/hooks/use-current-role";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/components/ui/use-toast';

type FormValues = z.infer<typeof ServiceSchema>;

const EditService = () => {
  const router = useRouter();
  const pathName = usePathname();
  const id = pathName.replace('/services/edit/', '');
  const [service, setService] = useState<Service | null>(null);
  const role = useCurrentRole();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      user_mail: "",
      client_name: "",
      phone: "",
      value: undefined,
      description: "",
      photo_url: "",
      max_time: new Date(),
    }
  });

  useEffect(() => {
    if (typeof id === 'string') {
      const fetchService = async () => {
        const fetchedService = await getServiceById(id);
        setService(fetchedService);
        if (fetchedService) {
          Object.keys(fetchedService).forEach((key) => {
            form.setValue(key as keyof FormValues, fetchedService[key as keyof typeof fetchedService]);
          });
        }
      };
      fetchService();
    }
  }, [id, form]);

  const onSubmit = async (data: FormValues) => {
    if (typeof id === 'string') {
      try {
        const result = await editService(id, data);
        if (result.success) {
          toast({
            title: "Sucesso!",
            description: "O serviço foi atualizado com sucesso.",
            variant: "success",
          });
          router.push(`/services/${id}`);
        } else {
          throw new Error(result.error || 'Erro desconhecido');
        }
      } catch (error) {
        console.error('Erro ao atualizar serviço', error);
        toast({
          title: "Erro",
          description: "Falha ao atualizar o serviço. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  if (!service) {
    return <div>Carregando...</div>;
  }

  return (
    <div className='relative w-full flex-grow h-full min-h-screen p-4'>
      <BackgroundImage src="/splash.webp" alt="Background" />
      <BackgroundImage src="/splash_desk.webp" alt="Background" isDesktop />
      <div className="relative z-20 flex flex-col items-center w-full gap-4">
        <div className='flex justify-between w-full'>
          <Navbar />
        </div>
        <h1 className="text-realce w-full py-2 rounded-xl text-xl font-bold text-center bg-transparent border border-realce">Editar Serviço</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-black w-full">
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4">
              <FormField
                control={form.control}
                name="user_mail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-realce'>Email do Cliente</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled={role !== 'ADMIN' && role !== 'MASTER'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-realce'>Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={role !== 'ADMIN' && role !== 'MASTER'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-realce'>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={role !== 'ADMIN' && role !== 'MASTER'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {role === 'MASTER' && (
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-realce'>Valor do Serviço</FormLabel>
                      <FormControl>
                        <div className="flex items-center border w-full rounded-md h-10 border-input pl-3">
                          <span className="mr-2 text-white">R$</span>
                          <Input {...field} placeholder="Valor" type="number" className="flex-1" value={field.value || ''} onChange={e => form.setValue('value', e.target.valueAsNumber)} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="max_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-realce'>Prazo</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" disabled={role !== 'ADMIN' && role !== 'MASTER'} onChange={(e) => { const selectedDate = new Date(e.target.value); form.setValue("max_time", selectedDate); }} value={field.value ? field.value.toISOString().substring(0, 10) : ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-realce'>Descrição do Serviço</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Descrição" disabled={role !== 'ADMIN' && role !== 'MASTER'} className='bg-white' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-realce text-black hover:bg-white" disabled={role !== 'ADMIN' && role !== 'MASTER'}>
              Salvar Alterações
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditService;