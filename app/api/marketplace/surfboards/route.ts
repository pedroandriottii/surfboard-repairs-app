import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { db } from "@/lib/db";
import { SurfboardSchema } from "@/schemas";

const ImageSchema = z.array(z.string().url());
const CoverImageSchema = z.string().url();

export async function POST(request: NextRequest) {
  try {
    const values = await request.json();

    const validatedFields = SurfboardSchema.safeParse(values);
    if (!validatedFields.success) {
      console.error("Erro de validação:", validatedFields.error);
      return NextResponse.json({ error: "Campos Inválidos!" }, { status: 400 });
    }

    const imageValidation = ImageSchema.safeParse(values.image);
    if (!imageValidation.success) {
      console.error("Erro de validação das imagens:", imageValidation.error);
      return NextResponse.json({ error: "Imagens inválidas!" }, { status: 400 });
    }

    const coverImageValidation = CoverImageSchema.safeParse(values.coverImage);
    if (!coverImageValidation.success) {
      console.error("Erro de validação da imagem de capa:", coverImageValidation.error);
      return NextResponse.json({ error: "Imagem de capa inválida!" }, { status: 400 });
    }

    const { title, description, price, surfboardBrandingId, volume, size } = validatedFields.data;
    const coverImage = CoverImageSchema.parse(values.coverImage);
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

    return NextResponse.json({ success: "Prancha criada com sucesso!" }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar a prancha:", error);
    return NextResponse.json({ error: "Erro ao criar a prancha!" }, { status: 500 });
  }
}