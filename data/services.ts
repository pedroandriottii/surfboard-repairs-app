import { db } from "@/lib/db";

// export const getServicesByEmail = async (email: string) => {
//     try{
//         const Service = await db.service.findUnique({ where: { email } });
        
//         return service;
//     }catch{
//         return null;
//     }
// }

export const getUserById = async (id: string) => {
    try{
        const user = await db.user.findUnique({ where: { id } });
        
        return user;
    }catch{
        return null;
    }
}