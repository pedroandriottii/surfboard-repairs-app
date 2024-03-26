"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
    const onServerActionClick = () => {
        admin().then((data) => {
            if(data.error){
                toast.error(data.error)
            
        }else{
            toast.success(data.success)
        }
    })
    }
    
    const onApiRouteClick = () => {
        fetch("/api/admin").then((response) => {
            if(response.ok){
                toast.success("Conexão Estabelecida")
            }else{
                toast.error("Credenciais inválidas")
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Admin
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess message="Você pode ver esse conteudo"/>
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Rota para ADMIN
                    </p>
                    <Button onClick={onApiRouteClick}>
                        Clique para Testar
                    </Button>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Rota para ADMIN Server
                    </p>
                    <Button onClick={onServerActionClick}>
                        Clique para Testar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default AdminPage;