/**
*  Rotas que serão acessíveis publicamente (Não precisam de autenticação) @type {string[]}
*/
export const publicRoutes = [
    "/",
    "/auth/new-verification",
    "/catalogo",
    "/api/marketplace/surfboards",
];

/**
 * Rotas que são utilizadas para autenticação, elas vão redirecionar usuários logados para /home @type {string[]}
*/

export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
];

/**
 *   Prefixo para rotas de API @type {string} 
*/

export const apiAuthPrefix = "/api/auth";

/**
 * Rota para redirecionar usuários logados @type {string}
*/

export const DEFAULT_LOGIN_REDIRECT = "/home";