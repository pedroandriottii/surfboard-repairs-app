"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface StatusSelectorProps {
    currentStatus: string;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ currentStatus }) => {
    const statuses = [
        { label: 'Prontos', value: 'ready' },
        { label: 'Pendentes', value: 'pending' },
        { label: 'Entregues', value: 'delivered' },
    ];

    return (
        <div className='flex gap-4 mr-4'>
            {statuses.map(({ label, value }) => (
                <Link href={`/services/status/${value}`} key={value}>
                    <Button
                        className={`${currentStatus === value ? 'bg-realce text-black' : 'bg-transparent border-2 border-realce text-realce'} rounded-xl max-h-8 hover:bg-white hover:text-black ${currentStatus === value ? '' : 'hover:bg-white hover:text-black'}`}>
                        {label}
                    </Button>
                </Link>
            ))}
        </div>
    );
};

export default StatusSelector;
