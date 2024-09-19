import { UserRole } from "@prisma/client";
import Cookies from 'js-cookie';

interface LoginData {
    email: string;
    password: string;
}

interface LoginResponse {
    error?: string;
    success?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        phone: string;
        role: UserRole;
    };
    accessToken?: string;
}

export async function login(data: LoginData): Promise<LoginResponse> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                error: errorData.message || 'Erro ao tentar fazer login. Verifique suas credenciais.',
            };
        }

        const result = await response.json();
        if (result.accessToken) {
            Cookies.set('accessToken', result.accessToken, { expires: 7 });
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        console.log(result)
        return {
            success: 'Login realizado com sucesso!',
            user: result.user,
            accessToken: result.accessToken,
        };
    } catch (error) {
        return {
            error: 'Erro de conexão. Por favor, tente novamente.',
        };
    }
}