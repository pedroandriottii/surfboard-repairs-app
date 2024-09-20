import Cookies from 'js-cookie';

export async function login(email: string, password: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao fazer login.');
        }

        Cookies.set('accessToken', data.accessToken, { expires: 1 });

        return { success: true, accessToken: data.accessToken, user: data.user, error: '' };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        } else {
            return { success: false, error: 'Erro desconhecido' };
        }
    }
}
