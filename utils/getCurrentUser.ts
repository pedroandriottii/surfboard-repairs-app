import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
}

export function getCurrentUser(): User | null {
  try {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      return JSON.parse(userFromStorage) as User;
    }

    const token = Cookies.get('accessToken');
    if (!token) {
      console.log('Token não encontrado nos cookies');
      return null;
    }

    return null;
  } catch (error) {
    console.error('Erro ao obter o usuário atual:', error);
    return null;
  }
}