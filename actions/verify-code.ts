export async function verifyCode(email: string, token: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, token })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao verificar código');
        }

        return { success: 'E-mail verificado com sucesso!', error: '' };
    } catch (error) {
        if (error instanceof Error) {
            return { success: '', error: error.message };
        }
        else {
            return { success: '', error: 'Erro desconhecido' };
        }

    }
}
