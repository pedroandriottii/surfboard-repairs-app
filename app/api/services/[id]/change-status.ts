import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { currentRole } from "@/lib/auth";
import { UserRole, ServiceStatus } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).end('Method Not Allowed');
  }

  const role = await currentRole();

  if (role !== UserRole.ADMIN) {
    return res.status(403).json({ message: "Acesso negado." });
  }

  const { id } = req.query;
  const { newStatus } = req.body;

  if (!Object.values(ServiceStatus).includes(newStatus)) {
    return res.status(400).json({ message: "Status inválido fornecido." });
  }

  try {
    const updatedService = await db.service.update({
      where: { id: String(id) },
      data: { status: newStatus },
    });
    return res.status(200).json(updatedService);
  } catch (error) {
    console.error('Erro ao atualizar o status do serviço', error);
    return res.status(500).json({ message: 'Erro ao atualizar o serviço no banco de dados.' });
  }
}
