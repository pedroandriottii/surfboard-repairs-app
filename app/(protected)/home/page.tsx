"use client";
import React, { useEffect, useState } from 'react';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HomePage = () => {
    const role = useCurrentRole();
    const user = useCurrentUser();
    const [services, setServices] = useState();

    if(role === "ADMIN"){
        return (
            <div>
                <h1>Olá {user?.name}</h1>
                <Button variant="default">
                    <Link href="/create-service">Registar Conserto</Link>
                </Button>
            </div>
        )
    }
    if(role === "USER"){
        return (
            <div>Olá {user?.name}

            </div>
        )
    }
}

export default HomePage;