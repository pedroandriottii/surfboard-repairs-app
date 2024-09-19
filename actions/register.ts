interface RegisterData {
    name: string
    email: string
    password: string
    phone: string
}

export async function register(userData: RegisterData): Promise<{ success: string; error: string }> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao cadastrar usuário')
        }

        return { success: 'Usuário cadastrado com sucesso. Verifique sua caixa de e-mail para valida-lo', error: '' }
    } catch (error) {
        if (error instanceof Error) {
            return { success: '', error: error.message }
        } else {
            return { success: '', error: 'Erro desconhecido' }
        }
    }
}