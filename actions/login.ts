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

        console.log(data)
        console.log(data.message)

        if (!response.ok) {
            if(response.status === 401 && data.message.includes('Email não verificado')){
                return { success: false, emailVerified: false, email}
            }
            throw new Error(data.message || 'Erro ao fazer login.');
        }
      
        return { success: true, accessToken: data.accessToken, user: data.user, error: ''};
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        } else {
            return { success: false, error: 'Erro desconhecido' };
        }
    }
}
