"use client";
import React, { useEffect, useState } from 'react';
import { getAllServices } from '@/data/services';
import { Service } from '@prisma/client';

const InfoCard: React.FC = () => {
    const [summaryData, setSummaryData] = useState({
        totalRevenue: 0,
        deliveredCount: 0,
        openServices: 0,
        pendingRevenue: 0
    });

    useEffect(() => {
        const fetchAndProcessData = async () => {
            const services: Service[] = await getAllServices() || [];
            const processedData = processGeneralData(services);
            setSummaryData(processedData);
        };

        fetchAndProcessData();
    }, []);

    const processGeneralData = (services: Service[]) => {
        return services.reduce((acc, service) => {
            if (service.status === 'DELIVERED') {
                acc.totalRevenue += service.value;
                acc.deliveredCount++;
            }
            if (service.status === 'PENDING' || service.status === 'READY') {
                acc.pendingRevenue += service.value;
            }
            acc.openServices++;
            return acc;
        }, { totalRevenue: 0, deliveredCount: 0, openServices: 0, pendingRevenue: 0 });
    };

    return (
        <div className='flex flex-col w-full gap-2 pt-4'>
            <div className='flex justify-between'>
                <h1>Faturamento Total:</h1>
                <p className='text-green-500'>{`$${summaryData.totalRevenue.toFixed(2)}`}</p>
            </div>
            <div className='flex justify-between'>
                <h1>Serviços Abertos</h1>
                <p className='text-green-500'>{summaryData.openServices}</p>
            </div>
            <div className='flex justify-between'>
                <h1>Consertos Entregues</h1>
                <p className='text-green-500'>{summaryData.deliveredCount}</p>
            </div>
            <div className='flex justify-between'>
                <h1>Valores a Receber</h1>
                <p className='text-green-500'>{`$${summaryData.pendingRevenue.toFixed(2)}`}</p>
            </div>
        </div>
    );
};

export default InfoCard;
