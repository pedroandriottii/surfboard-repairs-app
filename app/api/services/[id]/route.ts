import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { currentRole } from '@/lib/auth';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const role = await currentRole();

    if (role !== "MASTER") {
      return NextResponse.json({ error: "Você não tem permissão para excluir um serviço!" }, { status: 403 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID do serviço não fornecido!" }, { status: 400 });
    }

    try {
      const service = await db.service.delete({
        where: { id },
      });

      if (!service) {
        return NextResponse.json({ error: "Serviço não encontrado!" }, { status: 404 });
      }

      return NextResponse.json({ success: "Serviço excluído com sucesso!" }, { status: 200 });
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      return NextResponse.json({ error: "Erro ao excluir serviço no banco de dados." }, { status: 500 });
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}