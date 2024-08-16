"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SurfboardSchema } from "@/schemas";
import { createSurfboard } from "@/actions/create-surfboard";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { FormMessage } from "./form-messages";

export const SurfboardForm: React.FC = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(SurfboardSchema),
  });

  const handleError = (message: string) => {
    setError(message);
    setIsPending(false);
  };

  const uploadImages = async (files: FileList) => {
    const uploadPromises = Array.from(files).map(file => {
      return new Promise<string>((resolve, reject) => {
        const uniqueFileName = `${uuidv4()}_${file.name}`;
        const storageRef = ref(storage, `surfboards/${uniqueFileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

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
    });

    return Promise.all(uploadPromises);
  };

  const onSubmit = async (data: any) => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const files = fileInput?.files;

    if (!files || files.length === 0) {
      handleError("Selecione pelo menos uma imagem.");
      return;
    }

    setIsPending(true);

    try {
      const imageUrls = await uploadImages(files);

      const formData = {
        ...data,
        image: imageUrls,  // Adiciona as URLs das imagens ao formData
      };

      const response = await createSurfboard(formData);

      if (response.error) {
        alert(response.error);
      } else {
        alert(response.success);
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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
      <div>
        <label htmlFor="title">Título</label>
        <input id="title" {...register("title")} />
        <FormMessage message={errors.title?.message as string} />
      </div>

      <div>
        <label htmlFor="description">Descrição</label>
        <textarea id="description" {...register("description")} />
        <FormMessage message={errors.description?.message as string} />
      </div>

      <div>
        <label htmlFor="price">Preço</label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
        />
        <FormMessage message={errors.price?.message as string} />
      </div>

      <div>
        <label htmlFor="surfboardBrandingId">ID da Marca</label>
        <input id="surfboardBrandingId" {...register("surfboardBrandingId")} />
        <FormMessage message={errors.surfboardBrandingId?.message as string} />
      </div>

      <div>
        <label htmlFor="volume">Volume</label>
        <input
          id="volume"
          type="number"
          step="0.01"
          {...register("volume", { valueAsNumber: true })}
        />
        <FormMessage message={errors.volume?.message as string} />
      </div>

      <div>
        <label htmlFor="size">Tamanho</label>
        <input id="size" {...register("size")} />
        <FormMessage message={errors.size?.message as string} />
      </div>

      <div>
        <label htmlFor="coverImage">Imagem de Capa (URL)</label>
        <input id="coverImage" {...register("coverImage")} />
        <FormMessage message={errors.coverImage?.message as string} />
      </div>

      <div>
        <label htmlFor="image">Imagens</label>
        <input id="image" type="file" multiple />
        <FormMessage message={errors.image?.message as string} />
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? "Criando..." : "Criar Prancha"}
      </button>
    </form>
  );
};
