import Cookies from 'js-cookie';

export const getServiceById = async (id: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('accessToken')}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar serviço: ${response.statusText}`);
        }

        const service = await response.json();
        return service;
    }
    catch (error) {
        console.error("Erro ao buscar serviço pela API externa", error);
        return null;
    }
};