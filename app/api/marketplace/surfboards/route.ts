import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { db } from "@/lib/db";
import { SurfboardSchema } from "@/schemas";
import { currentRole } from '@/lib/auth';
import { SurfboardsCategory } from '@prisma/client';

const ImageSchema = z.array(z.string().url());
const CoverImageSchema = z.string().url();

export async function POST(request: NextRequest) {
  try {
    const role = await currentRole();

    const values = await request.json();
    console.log(values)

    if (role !== "ADMIN" && role !== "MASTER") {
      return NextResponse.json({ error: "Você não tem permissão para criar uma prancha!" }, { status: 403 });
    }

    const validatedFields = SurfboardSchema.safeParse(values);
    if (!validatedFields.success) {
      console.error("Erro de validação:", validatedFields.error);
      return NextResponse.json({ error: "Campos Inválidos!" }, { status: 400 });
    }

    console.log("Dados Validos", validatedFields.data);

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

    const { title, description, price, volume, size, model, category, is_new } = validatedFields.data;
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
        category,
        is_new,
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
    const category = request.nextUrl.searchParams.get('category');
    let surfboards;

    if (category) {
      if (!Object.values(SurfboardsCategory).includes(category as SurfboardsCategory)) {
        return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 });
      }

      surfboards = await db.surfboards.findMany({
        where: {
          category: category as SurfboardsCategory,
          is_new: true,
        },
      });

      if (surfboards.length === 0) {
        return NextResponse.json({ message: 'Nenhuma prancha encontrada para esta categoria.' }, { status: 404 });
      }
    } else {
      surfboards = await db.surfboards.findMany({
        where: {
          is_new: false,
        },
      });

      if (surfboards.length === 0) {
        return NextResponse.json({ message: 'Nenhuma prancha usada encontrada.' }, { status: 404 });
      }
    }

    return NextResponse.json(surfboards, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar pranchas de surf:", error);
    return NextResponse.json({ error: 'Erro ao buscar pranchas de surf.' }, { status: 500 });
  }
}

