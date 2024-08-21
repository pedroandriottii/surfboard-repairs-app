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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID da prancha não fornecido!" }, { status: 400 });
    }

    const surfboard = await db.surfboards.findUnique({
      where: { id },
    });

    if (!surfboard) {
      return NextResponse.json({ error: "Prancha não encontrada!" }, { status: 404 });
    }

    await db.surfboards.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Prancha deletada com sucesso!" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar a prancha de surf:", error);
    return NextResponse.json({ error: "Erro ao deletar a prancha de surf!" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID da prancha não fornecido!" }, { status: 400 });
    }

    const body = await request.json();
    const { price } = body;

    const updateData: any = {
      sold: new Date(),
    };

    if (price !== undefined) {
      updateData.price = price;
    }

    const updatedSurfboard = await db.surfboards.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedSurfboard, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar a prancha de surf:", error);
    return NextResponse.json({ error: "Erro ao atualizar a prancha de surf!" }, { status: 500 });
  }
}