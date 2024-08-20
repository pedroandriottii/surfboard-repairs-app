"use server";
import { db } from "@/lib/db";
import { SurfboardBranding } from "@prisma/client";

export const getAllSurfboardBrands = async (): Promise<SurfboardBranding[] | null> => {
    try {
        const brands = await db.surfboardBranding.findMany();
        return brands;
    } catch (error) {
        console.error("Erro ao buscar marcas de pranchas", error);
        return null;
    }
};

export const getSurfboardBrandById = async (id: string): Promise<SurfboardBranding | null> => {
    try {
        const brand = await db.surfboardBranding.findUnique({
            where: {
                id: id,
            },
        });
        return brand;
    } catch (error) {
        console.error("Erro ao buscar marca de prancha pelo ID", error);
        return null;
    }
};
