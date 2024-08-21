import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { ServiceSchema } from "@/schemas";
import { currentRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const role = await currentRole();

    const values = await request.json();

    if (role !== "ADMIN" && role !== "MASTER") {
      return NextResponse.json({ error: "Você não tem permissão para criar um serviço!" }, { status: 403 });
    }

    const validatedFields = ServiceSchema.safeParse(values);

    if (!validatedFields.success) {
      console.error("Erro de validação:", validatedFields.error);
      return NextResponse.json({ error: "Campos Inválidos! Status 400." }, { status: 400 });
    }

    const { client_name, user_mail, phone, value, max_time, description } = validatedFields.data;
    const status = "PENDING";
    const now_time = new Date();
    const photo_url = validatedFields.data.photo_url || "";

    try {
      const service = await db.service.create({
        data: {
          client_name,
          user_mail,
          phone,
          value,
          max_time,
          now_time,
          description,
          status,
          photo_url,
        }
      });

      return NextResponse.json({ success: "Serviço criado com sucesso!" }, { status: 201 });
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      return NextResponse.json({ error: "Erro ao inserir serviço no banco de dados." }, { status: 500 });
    }

  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}