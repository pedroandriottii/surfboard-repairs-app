"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';

interface StatusSelectorProps {
    currentStatus: string;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ currentStatus }) => {
    const [open, setOpen] = useState(false);

    const statuses = [
        { label: 'Prontos', value: 'ready' },
        { label: 'Pendentes', value: 'pending' },
        { label: 'Entregues', value: 'DELIVERED' },
    ];

    return (
        <div className='pr-4'>
            <Button
                onClick={() => setOpen(true)}
                className="bg-realce text-black hover:bg-white hover:text-black"
            >
                Filtrar Status
            </Button>

            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="bg-black text-white">
                    <DrawerHeader>
                        <DrawerTitle>Selecionar Status</DrawerTitle>
                        <DrawerClose />
                    </DrawerHeader>
                    <div className="p-4 space-y-4">
                        {statuses.map(({ label, value }) => (
                            <Link href={`/services/status/${value}`} key={value}>
                                <Button
                                    onClick={() => setOpen(false)}
                                    className={`${currentStatus === value ? 'bg-realce text-black' : 'bg-transparent border-2 border-realce text-realce'} mb-2 w-full rounded-xl hover:bg-white hover:text-black`}>
                                    {label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default StatusSelector;
