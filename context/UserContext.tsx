'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const fetchUser = async () => {
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
            console.error('Access token not found in cookies');
            setUser(null);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if(response.status === 401) {
                    Cookies.remove('accessToken');
                    setUser(null);
                    router.push('/auth/login');
                }
                throw new Error('Erro ao buscar o perfil do usuário');
            }

            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error(error);
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser deve ser usado dentro de um UserProvider");
    }
    return context;
};