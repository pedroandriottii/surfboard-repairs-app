import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


const HomePage = () => {
    return (
        <div>
            <Button>
                <Link href="/services">
                    Ver Serviços
                </Link>
            </Button>
            <Button>
                <Link href="/dashboard">
                    Ver Serviços
                </Link>
            </Button>
            <Button>
                <Link href="/services">
                    Ver Serviços
                </Link>
            </Button>
        </div>
    )
}

export default HomePage;