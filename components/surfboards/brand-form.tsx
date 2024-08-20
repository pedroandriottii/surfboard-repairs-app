"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrandSchema } from "@/schemas";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface BrandFormProps {
  onSuccess: () => void;
}

export const BrandForm: React.FC<BrandFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(BrandSchema),
  });

  const onSubmit = async (data: any) => {
    const response = await fetch('/api/marketplace/brands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.error) {
      console.error("Erro ao criar marca:", result.error);
    } else {
      reset();
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
      <Label htmlFor="name">Nome da Marca</Label>
      <Input id="name" {...register("name")} />
      <Button type="submit" className="w-full mt-4">Criar Marca</Button>
    </form>
  );
};