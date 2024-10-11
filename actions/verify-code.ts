export async function verifyCode(email: string, token: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, token }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao verificar código.');
        }

        return { success: true, accessToken: data.accessToken, message: "E-mail verificado com sucesso!", user: data.user };
    } catch (error) {
        return { success: false, message: (error instanceof Error ? error.message : 'Erro desconhecido ao verificar o código') };
    }
}
