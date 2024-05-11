"use server";

import * as z from "zod";

import { SettingsSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Usuário não encontrado" }
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Usuário não encontrado" }
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values
    }
  })

  return { success: "Configurações atualizadas com sucesso!" }
}