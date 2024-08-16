"use server"

import * as z from "zod";

import { db } from "@/lib/db"
import { BrandSchema } from "@/schemas";

export const createBrand = async (values: z.infer<typeof BrandSchema>) => {
  const validatedFields = BrandSchema.safeParse(values)

  if (!validatedFields.success) {
    console.error("Erro de validação:", validatedFields.error)
    return { error: "Campos Inválidos!" }
  }

  try {
    const { name } = validatedFields.data

    const brand = await db.surfboardBranding.create({
      data: {
        name,
      }
    })
    return { success: "Marca criada com sucesso" }
  } catch (error) {
    console.error("Erro ao criar marca:", error)
    return { error: "Erro ao inserir marca no banco de dados" }
  }
}