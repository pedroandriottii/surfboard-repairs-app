import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


const HomePage = () => {
    return (
        <div className='flex flex-col items-center gap-10 p-10 '>
            <Button className=' w-full h-full'>
                <Link href="/services">
                    Ver Serviços
                </Link>
            </Button>
            <Button className=' w-full h-full'>
                <Link href="/dashboard">
                    Relatórios
                </Link>
            </Button>
            <Button className=' w-full h-full'>
                <Link href="/services">
                    Ver Serviços
                </Link>
            </Button>
        </div>
    )
}

export default HomePage;