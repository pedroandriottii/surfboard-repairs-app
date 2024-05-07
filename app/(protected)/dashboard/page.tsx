"use client";
import React, { useEffect, useState } from 'react';
import { getAllServices } from '@/data/services';
import { Service } from '@prisma/client';

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

    useEffect(() => {
        const fetchAndProcessData = async () => {
            const services: Service[] = await getAllServices() || [];
            const data = processServicesData(services);
            setMonthlyData(data);
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

    return (
        <div className='p-4'>
            <h1 className='w-full bg-realce-seccondary-background p-2 rounded-lg text-center font-bold shadow-md mb-4'>Relatório de Serviços</h1>
            <div className='w-full bg-realce-seccondary-background rounded-lg'>
                {monthlyData.map(({ month, totalRevenue, count, openCount, revenuePending, revenueByPaymentMethod }) => (
                    <div key={month} className='p-2'>
                        <h1 className='bg-slate-800 text-white p-2  rounded-2xl text-center'>{month}</h1>
                        <div className='flex flex-col align-center text-center font-bold p-2'>
                            <p>Faturamento Total:</p>
                            <p>{`$${totalRevenue.toFixed(2)}`}</p>
                            <p>Consertos entregues:</p>
                            <p>{count}</p>
                            <p>Serviços Abertos:</p>
                            <p>{openCount}</p>
                            <p>Valores A Receber:</p>
                            <p>{`$${revenuePending.toFixed(2)}`}</p>
                            <p>Vendas no Pix:</p>
                            <p>{revenueByPaymentMethod.PIX}</p>
                            <p>Vendas no Crédito</p>
                            <p>{revenueByPaymentMethod.CREDIT_CARD}</p>
                            <p>Vendas no Débito</p>
                            <p>{revenueByPaymentMethod.DEBIT_CARD}</p>
                            <p>Vendas em Dinheiro</p>
                            <p>{revenueByPaymentMethod.CASH}</p>
                            <p>Vendas Gratuitas</p>
                            <p>{revenueByPaymentMethod.FREE}</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportsPage;
