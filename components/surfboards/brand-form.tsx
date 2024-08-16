"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrandSchema } from "@/schemas";
import { createBrand } from "@/actions/create-brand";

export const BrandForm: React.FC = () => {
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
      alert(response.error);
    } else {
      alert(response.success);
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
      <div>
        <label htmlFor="name">Nome da Marca</label>
        <input id="name" {...register("name")} />
      </div>

      <button type="submit">Criar Marca</button>
    </form>
  );
};
