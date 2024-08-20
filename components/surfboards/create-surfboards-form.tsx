'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SurfboardSchema } from "@/schemas";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { FormMessage } from "./form-messages";
import { Textarea } from '../ui/textarea';
import { useRouter } from 'next/navigation';

const SurfboardForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const router = useRouter()

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
        console.log("Form submitted", data);
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

            const response = await fetch('/api/marketplace/surfboards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || "Erro ao criar a prancha.");
            } else {
                setSuccess(result.success);
                reset();
                router.push('/home/marketplace')
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
                        <Input id="title" {...register("title")} required placeholder='Prancha Realce' />
                        <FormMessage message={errors.title?.message as string} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="model">Modelo</Label>
                        <Input id="model" {...register("model")} placeholder='Coringa' />
                        <FormMessage message={errors.model?.message as string} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea id="description" {...register("description")} placeholder='Triquílha' />
                        <FormMessage message={errors.description?.message as string} />
                    </div>
                    <div className='flex gap-4'>
                        <div className="space-y-1">
                            <Label htmlFor="volume">Volume</Label>
                            <Input id="volume" type="number" step="0.01" {...register("volume", { valueAsNumber: true })} placeholder='32' />
                            <FormMessage message={errors.volume?.message as string} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="size">Tamanho</Label>
                            <Input id="size" {...register("size")} placeholder={`5'10"`} />
                            <FormMessage message={errors.size?.message as string} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="price">Preço</Label>
                        <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} required placeholder='R$ 600' />
                        <FormMessage message={errors.price?.message as string} />
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
