import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { db } from "@/lib/db";
import { SurfboardSchema } from "@/schemas";
import { currentRole } from '@/lib/auth';

const ImageSchema = z.array(z.string().url());
const CoverImageSchema = z.string().url();

export async function POST(request: NextRequest) {
  try {
    const role = await currentRole();

    const values = await request.json();

    if (role !== "ADMIN" && role !== "MASTER") {
      return NextResponse.json({ error: "Você não tem permissão para criar uma prancha!" }, { status: 403 });
    }

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

    const { title, description, price, volume, size, model } = validatedFields.data;
    const coverImage = CoverImageSchema.parse(values.coverImage);
    const image = imageValidation.data;

    const surfboard = await db.surfboards.create({
      data: {
        title,
        description,
        price,
        image,
        model,
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

export async function GET(request: NextRequest) {
  try {
    const surfboards = await db.surfboards.findMany({
    });

    return NextResponse.json(surfboards, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar as pranchas de surf:", error);
    return NextResponse.json({ error: "Erro ao buscar as pranchas de surf!" }, { status: 500 });
  }
}
