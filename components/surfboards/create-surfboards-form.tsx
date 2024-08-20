'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { SurfboardBranding } from '@prisma/client';
import { getAllSurfboardBrands } from '@/data/brands';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SurfboardSchema } from "@/schemas";
import { createSurfboard } from "@/actions/create-surfboard";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { FormMessage } from "./form-messages";
import { Textarea } from '../ui/textarea';
import { BrandForm } from './brand-form';

const SurfboardForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
    const [brands, setBrands] = useState<SurfboardBranding[]>([]);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);

    const fetchBrands = async () => {
        const result = await getAllSurfboardBrands();
        setBrands(result ?? []);
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(SurfboardSchema),
    });

    const handleError = (message: string) => {
        setError(message);
        setIsPending(false);
    };

    const uploadImage = async (file: File) => {
        const uniqueFileName = `${uuidv4()}_${file.name}`;
        const storageRef = ref(storage, `surfboards/${uniqueFileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<string>((resolve, reject) => {
            uploadTask.on('state_changed',
                null,
                (error) => reject(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const uploadImages = async (files: FileList) => {
        const uploadPromises = Array.from(files).map(file => uploadImage(file));
        return Promise.all(uploadPromises);
    };

    const onSubmitForm = async (data: any) => {
        const coverImageInput = document.querySelector('input[name="coverImage"]') as HTMLInputElement | null;
        const coverImageFile = coverImageInput?.files?.[0];

        if (!coverImageFile) {
            handleError("Selecione uma imagem de capa.");
            return;
        }

        const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement | null;
        const files = fileInput?.files;

        if (!files || files.length === 0) {
            handleError("Selecione pelo menos uma imagem.");
            return;
        }

        setIsPending(true);

        try {
            const coverImageUrl = await uploadImage(coverImageFile);
            const imageUrls = await uploadImages(files);

            const formData = {
                ...data,
                coverImage: coverImageUrl,
                image: imageUrls,
            };

            onSubmit(formData);

            const response = await createSurfboard(formData);

            if (response.error) {
                setError(response.error);
            } else {
                setSuccess(response.success);
                reset();
            }
        } catch (error) {
            console.error("Erro ao criar a prancha:", error);
            handleError("Erro ao criar a prancha.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Prancha de Surf</CardTitle>
                    <CardDescription>
                        Cadastre as pranchas de surf que você tem disponíveis.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="title">Título</Label>
                        <Input id="title" {...register("title")} required />
                        <FormMessage message={errors.title?.message as string} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea id="description" {...register("description")} required />
                        <FormMessage message={errors.description?.message as string} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="surfboardBrandingId">Marca</Label>
                        <div className="flex items-center gap-2">
                            {brands.length > 0 ? (
                                <Select
                                    onValueChange={(value) => setValue("surfboardBrandingId", value)}
                                >
                                    <SelectTrigger id="surfboardBrandingId">
                                        <SelectValue placeholder="Selecione uma marca" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands.map((brand) => (
                                            <SelectItem key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p>Carregando Marcas</p>
                            )}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="ml-2 p-4 bg-realce">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Adicionar Nova Marca</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Preencha o formulário abaixo para adicionar uma nova marca.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <BrandForm onSuccess={() => {
                                        fetchBrands();
                                        const alertDialogTriggerElement = document.querySelector('[data-state="open"]');
                                        if (alertDialogTriggerElement) {
                                            (alertDialogTriggerElement as HTMLElement).click();
                                        }
                                    }} />
                                    <AlertDialogFooter>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline">Fechar</Button>
                                        </AlertDialogTrigger>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className="space-y-1">
                            <Label htmlFor="volume">Volume</Label>
                            <Input id="volume" type="number" step="0.01" {...register("volume", { valueAsNumber: true })} required />
                            <FormMessage message={errors.volume?.message as string} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="size">Tamanho</Label>
                            <Input id="size" {...register("size")} required />
                            <FormMessage message={errors.size?.message as string} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="coverImage">Imagem de Capa</Label>
                        <Input id="coverImage" name="coverImage" type="file" accept="image/*" required />
                        <FormMessage message={errors.coverImage?.message as string} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="image">Imagens</Label>
                        <Input id="image" name="image" type="file" multiple accept="image/*" required />
                        <FormMessage message={errors.image?.message as string} />
                    </div>
                </CardContent>
                <CardFooter>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Criando..." : "Criar Prancha"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
};

export default SurfboardForm;
