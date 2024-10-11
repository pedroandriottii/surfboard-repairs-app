"use client";
import React, { useEffect, useState } from 'react';
import { getAllServices } from '@/data/services';
import { Service, UserRole } from '@prisma/client';
import { MonthlyData } from '@/lib/types';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Navbar from '@/components/base/navbar';
import { useUser } from '@/context/UserContext';

const ReportsPage: React.FC = () => {
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const { user } = useUser();

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
            if (service.payment_method && !data[monthYear].revenueByPaymentMethod[service.payment_method]) { }
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
        <div className=' bg-black w-full h-full'>
            {user?.role === UserRole.MASTER && (
                <><div className='flex justify-between w-full md:pr-4'>
                    <Navbar />
                </div><div className='p-4'>

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
                    </div></>
            )}
        </div >
    );
};

export default ReportsPage;
