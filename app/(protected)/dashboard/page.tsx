"use client";
import React, { useEffect, useState } from 'react';
import { getAllServices } from '@/data/services';
import { Service, UserRole } from '@prisma/client';
import { RoleGate } from '@/components/auth/role-gate';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCurrentRole } from '@/hooks/use-current-role';
import { UserButton } from '@/components/auth/user-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface MonthlyData {
    month: string;
    totalRevenue: number;
    count: number;
    openCount: number;
    revenuePending: number;
    revenueByPaymentMethod: {
        PIX: number;
        FREE: number;
        CREDIT_CARD: number;
        DEBIT_CARD: number;
        CASH: number;
    };
}

const ReportsPage: React.FC = () => {
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const role = useCurrentRole();

    useEffect(() => {
        const fetchAndProcessData = async () => {
            const services: Service[] = await getAllServices() || [];
            const data = processServicesData(services);
            setMonthlyData(data);
            if (data.length > 0) {
                setSelectedMonth(data[0].month);
            }
        };

        fetchAndProcessData();
    }, []);

    const processServicesData = (services: Service[]): MonthlyData[] => {
        const data: { [key: string]: MonthlyData } = {};
        services.forEach(service => {
            const monthYear = service.now_time.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' });
            if (!data[monthYear]) {
                data[monthYear] = {
                    month: monthYear,
                    totalRevenue: 0,
                    count: 0,
                    openCount: 0,
                    revenuePending: 0,
                    revenueByPaymentMethod: {
                        PIX: 0,
                        FREE: 0,
                        CREDIT_CARD: 0,
                        DEBIT_CARD: 0,
                        CASH: 0,
                    }
                };
            }
            data[monthYear].revenueByPaymentMethod[service.payment_method] += service.value;
            if (service.status === 'DELIVERED') {
                data[monthYear].totalRevenue += service.value;
                data[monthYear].count++;
            }
            data[monthYear].openCount++;
            if (service.status === 'PENDING') {
                data[monthYear].revenuePending += service.value;
            }
            if (service.status === 'READY') {
                data[monthYear].revenuePending += service.value;
            }
        });
        return Object.values(data);
    };

    const selectedData = monthlyData.find(data => data.month === selectedMonth);

    return (
        <div className='p-4 bg-black w-full h-full'>
            <RoleGate allowedRole={UserRole.ADMIN}>
                <div className='flex justify-between w-full md:pr-4'>
                    <Image
                        src={'/realce_logo.png'}
                        alt="Realce Nordeste"
                        width={50}
                        height={50}
                    />
                    <div className='flex gap-4 items-center'>
                        <Link href={'/home'}>
                            <Button className='bg-transparent border-realce border-2 text-white hover:bg-white max-h-8 rounded-xl hover:text-black hover:border-none' >
                                Serviços
                            </Button>
                        </Link>

                        {role == 'ADMIN' && (
                            <div className='flex items-center gap-4'>
                                <Link href={'/dashboard'}>
                                    <Button className='bg-realce text-black hover:bg-white max-h-8 rounded-xl' >
                                        Finanças
                                    </Button>
                                </Link>
                            </div>
                        )}
                        <UserButton />
                    </div>
                </div>
                <h1 className='w-full bg-realce text-black p-2 rounded-lg text-center font-bold shadow-md mb-4'>Relatório de Serviços</h1>
                <div className='w-full bg-realce-seccondary-background rounded-lg p-4'>
                    <div className='mb-4'>
                        <p className="text-black font-bold py-2 ml-2">Selecione o Mês: </p>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="ml-2 p-2 rounded bg-input-color">
                                <SelectValue placeholder="Selecione um mês" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthlyData.map(({ month }) => (
                                    <SelectItem key={month} value={month}>
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedData && (
                        <div key={selectedData.month} className='p-2'>
                            <h1 className='bg-realce text-black font-bold uppercase shadow-md p-2 rounded-2xl text-center text-md'>{selectedData.month}</h1>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Faturamento</AccordionTrigger>
                                    <AccordionContent>
                                        <div className='flex items-center justify-between'>
                                            <p>Faturamento Total:</p>
                                            <p>{`R$ ${selectedData.totalRevenue.toFixed(2)}`}</p>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <p>Valores A Receber:</p>
                                            <p>{`R$ ${selectedData.revenuePending.toFixed(2)}`}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Consertos</AccordionTrigger>
                                    <AccordionContent>
                                        <div className='flex items-center justify-between'>
                                            <p>Consertos Abertos:</p>
                                            <p>{selectedData.openCount}</p>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <p>Consertos Finalizados:</p>
                                            <p>{selectedData.count}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Métodos de Pagamento</AccordionTrigger>
                                    <AccordionContent>
                                        <div className='flex items-center justify-between'>
                                            <p>Vendas no Pix:</p>
                                            <p>R$ {selectedData.revenueByPaymentMethod.PIX}</p>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <p>Vendas no Crédito</p>
                                            <p>R$ {selectedData.revenueByPaymentMethod.CREDIT_CARD}</p>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <p>Vendas no Débito</p>
                                            <p>R$ {selectedData.revenueByPaymentMethod.DEBIT_CARD}</p>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <p>Vendas em Dinheiro</p>
                                            <p>R$ {selectedData.revenueByPaymentMethod.CASH}</p>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <p>Vendas Gratuitas</p>
                                            <p>R$ {selectedData.revenueByPaymentMethod.FREE}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    )}
                </div>
            </RoleGate >
        </div >
    );
};

export default ReportsPage;
