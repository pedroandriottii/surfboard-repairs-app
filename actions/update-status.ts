"use server";

import * as z from "zod";

import { ChangeStatusSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { getServiceById } from "@/data/services";

export const updateStatus = async (
  values: z.infer<typeof ChangeStatusSchema>
) => {

  const user = await currentUser();

  if (!user) {
    return { error: "Usuário não encontrado" }
  }

  const dbUser = await getServiceById();

  if (!dbUser) {
    return { error: "Usuário não encontrado" }
  }
}