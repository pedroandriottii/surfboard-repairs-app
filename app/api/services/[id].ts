"use server";
import { NextApiRequest, NextApiResponse } from "next";
import { updateServiceStatus } from "@/data/services";
import { currentUser } from "@/lib/auth";
import { ServiceStatus, UserRole } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const user = await currentUser();
    if (!user || user.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: 'Não autorizado' });
    }

    const { id } = req.query as { id: string };
    const { status } = req.body as { status: ServiceStatus };

    try {
        const updatedService = await updateServiceStatus(id, status);
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o serviço' });
    }
}
