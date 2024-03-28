"use server";
import { db } from "@/lib/db";

export const getServicesByEmail = async (email: string) => {
    try{
        const services = await db.service.findMany({
            where: {
                user_mail: email,
            },
        });
        return services;
    } catch (error) {
        console.error("Erro ao buscar serviços pelo email do usuário", error)
        return null;
    }

}

export const getAllServices = async () => {
    try{
        const services = await db.service.findMany();
        return services;
    }
    catch(error){
        console.error("Erro ao buscar serviços", error);
        return null;
    }
}