"use client";
import React, { useEffect, useState } from 'react';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAllServices, getServicesByEmail } from '@/data/services';
import { Service } from '@prisma/client';

const HomePage = () => {
    const role = useCurrentRole();
    const user = useCurrentUser();
    const [services, setServices] = useState <Service[] | null>();

    if(role === "USER") {
        useEffect(() => {
            const getServices = async () => {
              const services = await getServicesByEmail(user?.email!!)
              setServices(services);
            }
        
            getServices();
        }, [user?.email])
    }
    if(role === "ADMIN"){
        useEffect(() => {
            const getServices = async () => {
              const services = await getAllServices()
              setServices(services);
            }
        
            getServices();
        }, [user?.email])
    }
    



    if(role === "ADMIN"){
        return (
            <div>
                <h1>Olá {user?.name}</h1>
                {services?.map((service) => {
                    return (
                        <div key={service.id}>
                            <h2>{service.client_name}</h2>
                            <p>{service.description}</p>
                        </div>
                    )
                })
                }
                <Button variant="default">
                    <Link href="/create-service">Registar Conserto</Link>
                </Button>
            </div>
        )
    }
    if(role === "USER"){
        return (
            <div>
                <h1>Olá {user?.name}</h1>
                {services?.map((service) => {
                    return (
                        <div key={service.id}>
                            <h2>{service.client_name}</h2>
                            <p>{service.description}</p>
                        </div>
                    )
                })
                }
            </div>
        )
    }
}

export default HomePage;