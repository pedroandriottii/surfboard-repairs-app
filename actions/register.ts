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
        console.log(response)
        const data = await response.json()
        console.log(data)
        if (!response.ok) {
            if(response.status === 409) {
                throw new Error(data.message || 'Email ou telefone já está em uso.')
            } 
            if(response.status === 400) {
                throw new Error(data.message || 'A senha deve conter pelo menos uma letra maiúscula, um número e ter entre 6 a 18 caracteres.')
            }
            else {
                throw new Error(data.message || 'Erro ao tentar cadastrar usuário.')
            }
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