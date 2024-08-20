import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID da prancha não fornecido!" }, { status: 400 });
    }

    const surfboard = await db.surfboards.findUnique({
      where: { id },
      include: {
        branding: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!surfboard) {
      return NextResponse.json({ error: "Prancha não encontrada!" }, { status: 404 });
    }

    return NextResponse.json(surfboard, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar a prancha de surf:", error);
    return NextResponse.json({ error: "Erro ao buscar a prancha de surf!" }, { status: 500 });
  }
}