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
import { FormError } from '../form-error';
import { Textarea } from '../ui/textarea';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import imageCompression from 'browser-image-compression';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const SurfboardForm: React.FC = () => {
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isNew, setIsNew] = useState<boolean>(false);
    const [category, setCategory] = useState<string | undefined>(undefined);
    const router = useRouter()
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(SurfboardSchema),
    });

    const compressImage = async (file: File) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };
        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error("Erro ao comprimir a imagem:", error);
            throw error;
        }
    };

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
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => reject(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const uploadImages = async (files: File[]) => {
        const uploadPromises = files.map(file => uploadImage(file));
        return Promise.all(uploadPromises);
    };

    const onSubmitForm = async (data: any) => {
        console.log("formulario submetido", data)
        const coverImageInput = document.querySelector('input[name="coverImage"]') as HTMLInputElement | null;
        const coverImageFile = coverImageInput?.files?.[0];

        if (!coverImageFile) {
            handleError("Selecione uma imagem de capa.");
            toast({
                title: "Erro",
                description: "Selecione uma imagem de capa.",
                variant: "destructive",
            });
            return;
        }

        const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement | null;
        const files = fileInput?.files;

        if (!files || files.length === 0) {
            handleError("Selecione pelo menos uma imagem.");
            toast({
                title: "Erro",
                description: "Selecione pelo menos uma imagem.",
                variant: "destructive",
            });
            return;
        }

        setIsPending(true)
        try {
            const compressedCoverImageFile = await compressImage(coverImageFile);
            const coverImageUrl = await uploadImage(compressedCoverImageFile);

            const compressedFiles = await Promise.all(Array.from(files).map(file => compressImage(file)));
            const imageUrls = await uploadImages(compressedFiles);

            const formData = {
                ...data,
                coverImage: coverImageUrl,
                image: imageUrls,
                is_new: isNew,
                category: isNew ? category : undefined,
            };
            console.log(formData);

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
                toast({
                    title: "Erro",
                    description: result.error || "Erro ao criar a prancha.",
                    variant: "destructive",
                });
            } else {
                setSuccess(result.success);
                toast({
                    title: "Sucesso!",
                    description: "A prancha foi cadastrada com sucesso.",
                    variant: "success",
                });
                reset();
                router.push('/home/marketplace');
            }
        } catch (error) {
            console.error("Erro ao criar a prancha:", error);
            handleError("Erro ao criar a prancha.");
            toast({
                title: "Erro",
                description: "Erro ao criar a prancha.",
                variant: "destructive",
            });
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
                        <FormError message={errors.title?.message as string} />
                    </div>
                    <div className="space-y-1 flex items-center gap-4">
                        <Label htmlFor="is_new">A prancha é nova?</Label>
                        <Switch
                            id="isNew"
                            checked={isNew}
                            onCheckedChange={(checked) => {
                                setIsNew(checked);
                                setValue("is_new", checked);
                            }}
                        />
                    </div>
                    {isNew && (
                        <div className="space-y-1">
                            <Label htmlFor="category">Categoria</Label>
                            <Select onValueChange={(value) => {
                                setValue("category", value);
                                setCategory(value);
                                console.log("Categoria selecionada:", value);
                            }}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BANDIDA">BANDIDA</SelectItem>
                                    <SelectItem value="CORINGA">CORINGA</SelectItem>
                                    <SelectItem value="MR">M.R</SelectItem>
                                    <SelectItem value="FISH_70">FISH 70 & TAL</SelectItem>
                                    <SelectItem value="GOO_FISH">GOO FISH</SelectItem>
                                    <SelectItem value="FISH_SUPER">FISH SUPER CAT</SelectItem>
                                    <SelectItem value="MINI_FUN">MINI FUN</SelectItem>
                                    <SelectItem value="MINI_LONG">MINI LONG</SelectItem>
                                    <SelectItem value="LONG">LONG</SelectItem>
                                    <SelectItem value="KITE_SURF">KITE SURF</SelectItem>
                                    <SelectItem value="KITE_FOIL">KITE FOIL</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="space-y-1">
                        <Label htmlFor="model">Modelo</Label>
                        <Input id="model" {...register("model")} placeholder='Coringa' />
                        <FormError message={errors.model?.message as string} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea id="description" {...register("description")} placeholder='Triquilha' />
                        <FormError message={errors.description?.message as string} />
                    </div>
                    <div className='flex gap-4'>
                        <div className="space-y-1">
                            <Label htmlFor="volume">Volume</Label>
                            <Input
                                id="volume"
                                type="number"
                                step="0.01"
                                {...register("volume")}
                                placeholder='32'
                            />
                            <FormError message={errors.volume?.message as string} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="size">Tamanho</Label>
                            <Input id="size" {...register("size")} placeholder={`5'10"`} />
                            <FormError message={errors.size?.message as string} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="price">Preço</Label>
                        <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} required placeholder='R$ 600' />
                        <FormError message={errors.price?.message as string} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="coverImage">Imagem de Capa</Label>
                        <Input id="coverImage" name="coverImage" type="file" accept="image/*" required />
                        <FormError message={errors.coverImage?.message as string} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="image">Imagens</Label>
                        <Input id="image" name="image" type="file" multiple accept="image/*" required />
                        <FormError message={errors.image?.message as string} />
                    </div>
                    {isPending && <Progress value={uploadProgress} />}
                </CardContent>
                <CardFooter>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <Button type="submit" disabled={isPending} className='w-full bg-realce text-black hover:bg-realce/80'>
                        {isPending ? "Criando..." : "Criar Prancha"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
};

export default SurfboardForm;