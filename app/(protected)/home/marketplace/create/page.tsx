'use client';

import { RoleGate } from '@/components/auth/role-gate';
import Navbar from '@/components/base/navbar';
import { useCurrentRole } from '@/hooks/use-current-role';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackgroundImage from '@/components/base/backgroundImage';
import SurfboardForm from '@/components/surfboards/create-surfboards-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Page: React.FC = () => {
    const role = useCurrentRole() ?? null;

    const handleSurfboardSubmit = (formData: any) => {
        const brandId = formData.surfboardBrandingId;
        console.log("Selected Brand ID:", brandId);
    };

    return (
        <div className='relative w-full flex flex-col min-h-screen'>
            <BackgroundImage src="/splash.png" alt="Background" />
            <BackgroundImage src="/splash_desk.png" alt="Background" isDesktop />
            <div className="relative z-20 flex flex-col items-center w-full">
                <Navbar role={role} />
                <div className='p-4 flex flex-col gap-4'>
                    <h1 className='items-center flex w-full justify-center p-2 bg-realce rounded-md'>Área de Cadastro</h1>
                    <RoleGate allowedRoles={['ADMIN', 'MASTER']}>
                        <Tabs defaultValue="surfboard">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="surfboard">Pranchas</TabsTrigger>
                                <TabsTrigger value="accessories">Acessórios</TabsTrigger>
                            </TabsList>
                            <TabsContent value="surfboard">
                                <SurfboardForm onSubmit={handleSurfboardSubmit} />
                            </TabsContent>
                            <TabsContent value="accessories">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Acessórios</CardTitle>
                                        <CardDescription>
                                            Cadastre os acessórios que você tem disponíveis.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="accessory-name">Nome</Label>
                                            <Input id="accessory-name" placeholder="Nome do acessório" required />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="accessory-description">Descrição</Label>
                                            <Input id="accessory-description" placeholder="Descrição do acessório" required />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="accessory-price">Preço</Label>
                                            <Input id="accessory-price" placeholder="0,00" type="number" step="0.01" required />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit">Cadastrar</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </RoleGate>
                </div>
            </div>
        </div >
    );
};

export default Page;
