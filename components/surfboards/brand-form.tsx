"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrandSchema } from "@/schemas";
import { createBrand } from "@/actions/create-brand";
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
    const response = await createBrand(data);
    if (response.error) {
    } else {
      reset();
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
      <Label htmlFor="name">Nome da Marca</Label>
      <Input id="name" {...register("name")} />
      <Button type="button" className="w-full mt-4" onClick={handleSubmit(onSubmit)}>Criar Marca</Button>
    </form>
  );
};
