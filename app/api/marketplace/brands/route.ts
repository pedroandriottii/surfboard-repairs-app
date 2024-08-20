import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { BrandSchema } from "@/schemas";


export async function GET(request: NextRequest) {
  try {
    const brands = await db.surfboardBranding.findMany();
    return NextResponse.json(brands);
  } catch (error) {
    console.error("Erro ao buscar marcas de pranchas", error);
    return NextResponse.json({ error: "Erro ao buscar marcas de pranchas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const values = await request.json();

    const validatedFields = BrandSchema.safeParse(values);

    if (!validatedFields.success) {
      console.error("Erro de validação:", validatedFields.error);
      return NextResponse.json({ error: "Campos Inválidos!" }, { status: 400 });
    }

    const { name } = validatedFields.data;

    const brand = await db.surfboardBranding.create({
      data: {
        name,
      }
    });

    return NextResponse.json({ success: "Marca criada com sucesso", brand });
  } catch (error) {
    console.error("Erro ao criar marca:", error);
    return NextResponse.json({ error: "Erro ao inserir marca no banco de dados" }, { status: 500 });
  }
}