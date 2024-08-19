"use server"

import * as z from "zod";
import { db } from "@/lib/db";
import { SurfboardSchema } from "@/schemas";

const ImageSchema = z.array(z.string().url());

export const createSurfboard = async (values: z.infer<typeof SurfboardSchema> & { image: string[] }) => {
  console.log("Received values:", values);

  const validatedFields = SurfboardSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error("Erro de validação:", validatedFields.error);
    return { error: "Campos Inválidos!" };
  }

  const imageValidation = ImageSchema.safeParse(values.image);
  if (!imageValidation.success) {
    console.error("Erro de validação das imagens:", imageValidation.error);
    return { error: "Imagens inválidas!" };
  }

  try {
    const { title, description, price, surfboardBrandingId, volume, size } = validatedFields.data;
    const coverImage = validatedFields.data.coverImage || "";
    const image = imageValidation.data;

    const surfboard = await db.surfboards.create({
      data: {
        title,
        description,
        price,
        image,
        surfboardBrandingId,
        coverImage,
        volume,
        size,
        registered: new Date(),
      },
    });

    return { success: "Prancha criada com sucesso!" };
  } catch (error) {
    console.error("Erro ao criar a prancha:", error);
    return { error: "Erro ao criar a prancha!" };
  }
};