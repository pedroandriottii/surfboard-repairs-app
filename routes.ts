// Rotas que serão acessíveis publicamente (Não precisam de autenticação) @type {string[]}

export const publicRoutes = [
    "/"

]

// Rotas que são utilizadas para autenticação, elas vão redirecionar usuários logados para /settings @type {string[]}

export const authRoutes = [
    "/auth/login",
    "/auth/register",
]

// Prefixo para rotas de API @type {string} 

export const apiAuthPrefix = "/api/auth"

// Rota para redirecionar usuários logados @type {string}

export const DEFAULT_LOGIN_REDIRECT = "/settings"